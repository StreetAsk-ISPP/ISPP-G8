import json
import os
import re
import time
from collections import defaultdict
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API_BASE = "https://api.github.com"

# Admins who can request changes
ADMINS = {"javpalgon", "santiabregu", "manumnzz", "Glinbor10"}

# Issue type labels
ISSUE_TYPES = {
    "documentation": "📚 Documentation",
    "feature": "✨ Feature",
    "fix": "🐛 Fix"
}


class GitHubClient:
    def __init__(self, token: str):
        self.token = token

    def _request(self, method: str, path: str, params: dict | None = None, payload: dict | None = None):
        if params:
            path = f"{path}?{urlencode(params)}"

        body = None
        if payload is not None:
            body = json.dumps(payload).encode("utf-8")

        url = f"{API_BASE}{path}"
        headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {self.token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "performance-metrics-bot",
        }

        attempts = 0
        while attempts < 5:
            attempts += 1
            req = Request(url, data=body, headers=headers, method=method)
            try:
                with urlopen(req, timeout=60) as response:  # nosec B310
                    data = response.read().decode("utf-8")
                    parsed = json.loads(data) if data else {}
                    response_headers = dict(response.headers.items())
                    return parsed, response_headers
            except HTTPError as err:
                reset_at = err.headers.get("X-RateLimit-Reset")
                remaining = err.headers.get("X-RateLimit-Remaining")

                if err.code in (403, 429) and (remaining == "0" or "rate limit" in err.reason.lower()):
                    wait_seconds = 60
                    if reset_at:
                        wait_seconds = max(int(reset_at) - int(time.time()) + 2, 1)
                    print(f"Rate limit reached. Waiting {wait_seconds}s before retry...")
                    time.sleep(wait_seconds)
                    continue

                error_body = err.read().decode("utf-8", errors="replace")
                raise RuntimeError(f"GitHub API error {err.code} on {path}: {error_body}") from err
            except URLError as err:
                if attempts >= 5:
                    raise RuntimeError(f"Network error calling GitHub API on {path}: {err}") from err
                time.sleep(2 * attempts)

        raise RuntimeError(f"Failed API request after retries: {method} {path}")

    def get_paginated(self, path: str, params: dict | None = None):
        page = 1
        all_items = []
        while True:
            current_params = dict(params or {})
            current_params.update({"per_page": 100, "page": page})
            data, _ = self._request("GET", path, params=current_params)
            if not isinstance(data, list):
                raise RuntimeError(f"Expected list response from {path}, got: {type(data).__name__}")
            all_items.extend(data)
            if len(data) < 100:
                break
            page += 1
        return all_items

    def get(self, path: str, params: dict | None = None):
        data, _ = self._request("GET", path, params=params)
        return data


def parse_dt(value: str | None):
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def extract_sprint_number(labels: list) -> int | None:
    """Extract sprint number from labels (e.g., 'SPRINT 1', 'SPRINT 2')"""
    for label in labels:
        match = re.search(r'SPRINT\s+(\d+)', label.get("name", ""), re.IGNORECASE)
        if match:
            return int(match.group(1))
    return None


def get_issue_type(labels: list) -> str:
    """Get issue type from labels"""
    label_names = {label.get("name", "").lower() for label in labels}
    
    for key, display in ISSUE_TYPES.items():
        if key in label_names:
            return display
    
    return "❓ Other"


def check_pr_changes_requested(gh: GitHubClient, owner: str, repo: str, issue_number: int, issue_data: dict) -> dict:
    """
    Check if the associated PR has changes requested by admins.
    Returns: {
        "has_pr": bool,
        "pr_number": int | None,
        "changes_requested": bool,
        "requested_by": list[str],
        "commits_by_contributor": int,
        "commits_by_admin": int,
        "has_contributor_commits_after_review": bool,
        "has_admin_commits_after_review": bool
    }
    """
    result = {
        "has_pr": False,
        "pr_number": None,
        "changes_requested": False,
        "requested_by": [],
        "commits_by_contributor": 0,
        "commits_by_admin": 0,
        "has_contributor_commits_after_review": False,
        "has_admin_commits_after_review": False
    }

    # Check if issue has associated PR via PR linking
    related_prs = None
    try:
        # Search for PRs that close or reference this issue
        search_query = f"repo:{owner}/{repo} is:pr #{issue_number}"
        search_result = gh.get("/search/issues", params={"q": search_query, "per_page": 5})
        related_prs = search_result.get("items", [])
    except:
        pass

    if not related_prs:
        return result

    for pr in related_prs:
        if pr.get("pull_request"):
            result["has_pr"] = True
            result["pr_number"] = pr.get("number")
            pr_author = pr.get("user", {}).get("login", "")
            
            try:
                # Get PR reviews
                reviews = gh.get_paginated(
                    f"/repos/{owner}/{repo}/pulls/{pr['number']}/reviews",
                    params={"per_page": 100}
                )
                
                # Check for changes_requested state
                changes_reviews = [r for r in reviews if r.get("state") == "CHANGES_REQUESTED"]
                
                if changes_reviews:
                    result["changes_requested"] = True
                    # Get unique admin reviewers who requested changes
                    for review in changes_reviews:
                        reviewer = review.get("user", {}).get("login", "")
                        if reviewer in ADMINS and reviewer not in result["requested_by"]:
                            result["requested_by"].append(reviewer)
                    
                    # Check commits after first review request
                    if result["requested_by"]:
                        first_review_requested = min([r.get("submitted_at") for r in changes_reviews if r.get("submitted_at")])
                        first_review_dt = parse_dt(first_review_requested)
                        
                        # Get PR commits
                        commits = gh.get_paginated(
                            f"/repos/{owner}/{repo}/pulls/{pr['number']}/commits",
                            params={"per_page": 100}
                        )
                        
                        # Analyze commits after review was requested (excluding merges)
                        if first_review_dt:
                            for commit in commits:
                                commit_date = parse_dt(commit.get("commit", {}).get("committer", {}).get("date"))
                                commit_author = commit.get("commit", {}).get("author", {}).get("name", "")
                                commit_message = commit.get("commit", {}).get("message", "")
                                
                                # Skip merge commits
                                is_merge = commit_message.strip().startswith("Merge ")
                                
                                if commit_date and commit_date > first_review_dt and not is_merge:
                                    # Check if this commit is by an admin or PR author
                                    ghuser = commit.get("author", {})
                                    login = ghuser.get("login", "") if ghuser else ""
                                    
                                    if login in ADMINS:
                                        result["commits_by_admin"] += 1
                                        result["has_admin_commits_after_review"] = True
                                    elif login == pr_author or login == "":
                                        # Commit by PR author (contributor)
                                        result["commits_by_contributor"] += 1
                                        result["has_contributor_commits_after_review"] = True
                
            except Exception as e:
                print(f"Warning: Could not fetch PR details for #{pr.get('number')}: {e}")
            
            break

    return result


def calculate_performance_score(data: dict) -> float:
    """
    Calculate a performance score from 0-10 for a contributor based on their metrics.
    
    Scoring criteria:
    - Base: 5 points
    - Issue completion: 0-3 points (based on total issues)
    - Quality: 0-2 points (% of issues without changes requested)
    - Responsividad: ±0.3 points (contributor fixes vs admin fixes)
    
    Returns: float score from 0.0 to 10.0
    """
    score = 5.0  # Base score
    
    total_issues = data["total_issues"]
    prs_with_changes = data["prs_with_changes"]
    commits_by_contributor = data.get("commits_by_contributor", 0)
    commits_by_admin = data.get("commits_by_admin", 0)
    has_contributor_commits = data.get("has_contributor_commits_after_review", False)
    has_admin_commits = data.get("has_admin_commits_after_review", False)
    
    # Issue completion component (0-3 points)
    # Minimum 1 issue to get any points
    if total_issues >= 8:
        score += 3.0
    elif total_issues >= 5:
        score += 2.0
    elif total_issues >= 2:
        score += 1.0
    elif total_issues >= 1:
        score += 0.0  # 1 issue = 0 bonus points (but already have 5 base)
    
    # Quality component (0-2 points)
    # Based on how many PRs didn't need changes
    if total_issues > 0:
        prs_without_changes = total_issues - prs_with_changes
        quality_rate = prs_without_changes / total_issues
        
        if quality_rate >= 0.8:  # 80%+ without changes
            score += 2.0
        elif quality_rate >= 0.6:  # 60-79% without changes
            score += 1.5
        elif quality_rate >= 0.4:  # 40-59% without changes
            score += 1.0
        elif quality_rate >= 0.2:  # 20-39% without changes
            score += 0.5
        # else: 0 bonus points if too many issues with changes
        
        # Responsivity bonus/penalty (±0.3 points)
        # If contributor fixed their own issues: +0.3
        # If admin had to fix issues: -0.3
        if prs_with_changes > 0:
            if has_contributor_commits and commits_by_contributor > 0:
                # Contributor responded to feedback positively
                score += 0.3
            elif has_admin_commits and commits_by_admin > 0 and commits_by_contributor == 0:
                # Admin had to make the fixes (contributor didn't respond)
                score -= 0.3
    
    # Ensure score is between 0 and 10
    return max(0.0, min(10.0, score))


def calculate_contributor_metrics(issues_by_sprint: dict, gh: GitHubClient, owner: str, repo: str) -> dict:
    """Calculate metrics for each contributor per sprint"""
    metrics = {}
    
    for sprint_num in sorted(issues_by_sprint.keys()):
        issues = issues_by_sprint[sprint_num]
        contributors_data = defaultdict(lambda: {
            "total_issues": 0,
            "by_type": defaultdict(int),
            "prs_with_changes": 0,
            "commits_by_contributor": 0,
            "commits_by_admin": 0,
            "has_contributor_commits_after_review": False,
            "has_admin_commits_after_review": False,
            "changes_requested_by_admin": defaultdict(list)
        })
        
        for issue in issues:
            assignees = issue.get("assignees", [])
            if not assignees:
                assignees = [{"login": "unassigned"}]
            
            issue_type = get_issue_type(issue.get("labels", []))
            
            # Get PR change info
            pr_info = check_pr_changes_requested(gh, owner, repo, issue.get("number"), issue)
            
            for assignee in assignees:
                login = assignee.get("login", "unknown")
                
                contributors_data[login]["total_issues"] += 1
                contributors_data[login]["by_type"][issue_type] += 1
                
                if pr_info["changes_requested"]:
                    contributors_data[login]["prs_with_changes"] += 1
                    for admin in pr_info["requested_by"]:
                        if admin not in contributors_data[login]["changes_requested_by_admin"][login]:
                            contributors_data[login]["changes_requested_by_admin"][login].append(admin)
                
                # Track commits by contributor vs admin
                if pr_info["commits_by_contributor"] > 0:
                    contributors_data[login]["commits_by_contributor"] += pr_info["commits_by_contributor"]
                    contributors_data[login]["has_contributor_commits_after_review"] = True
                
                if pr_info["commits_by_admin"] > 0:
                    contributors_data[login]["commits_by_admin"] += pr_info["commits_by_admin"]
                    contributors_data[login]["has_admin_commits_after_review"] = True
        
        # Calculate performance scores
        for contributor in contributors_data:
            score = calculate_performance_score(contributors_data[contributor])
            contributors_data[contributor]["performance_score"] = score
        
        metrics[f"Sprint {sprint_num}"] = dict(contributors_data)
    
    return metrics


def get_score_status(score: float, threshold: float = 6.0) -> str:
    """Get status indicator based on score and threshold"""
    if score >= threshold:
        return "✅"
    else:
        return "⚠️"


def build_report(repo: str, generated_at: datetime, metrics: dict, threshold: float = 6.0) -> str:
    """Build markdown report with performance metrics"""
    lines = [
        "# Performance Metrics Report - Individual Contributors",
        "",
        f"- Repository: `{repo}`",
        f"- Generated at (UTC): `{generated_at.strftime('%Y-%m-%d %H:%M:%S')}`",
        f"- Performance Threshold: `{threshold}/10`",
        "",
    ]
    
    if not metrics:
        lines.extend([
            "No sprints with issues found.",
            "",
        ])
        return "\n".join(lines)
    
    for sprint_name in sorted(metrics.keys()):
        contributors = metrics[sprint_name]
        
        lines.extend([
            f"## {sprint_name}",
            "",
        ])
        
        if not contributors:
            lines.append("No contributors assigned to issues in this sprint.")
            lines.append("")
            continue
        
        # Create table header
        lines.extend([
            "| Contributor | Score | Status | Total Issues | 📚 Doc | ✨ Features | 🐛 Fixes | Changes Requested | Commits After Review | Admins |",
            "|---|---:|---|---:|---:|---:|---:|---:|---|---|",
        ])
        
        # Add contributor rows, sorted by score (descending)
        sorted_contributors = sorted(
            contributors.items(),
            key=lambda x: x[1].get("performance_score", 0),
            reverse=True
        )
        
        for contributor, data in sorted_contributors:
            score = data.get("performance_score", 0.0)
            status = get_score_status(score, threshold)
            
            total = data["total_issues"]
            doc_count = data["by_type"]["📚 Documentation"]
            feat_count = data["by_type"]["✨ Feature"]
            fix_count = data["by_type"]["🐛 Fix"]
            
            changes_count = data["prs_with_changes"]
            contributor_commits = data["commits_by_contributor"]
            admin_commits = data["commits_by_admin"]
            
            admins_str = ""
            if data["changes_requested_by_admin"]:
                all_admins = set()
                for admins_list in data["changes_requested_by_admin"].values():
                    all_admins.update(admins_list)
                admins_str = ", ".join(sorted(all_admins)) if all_admins else "-"
            else:
                admins_str = "-"
            
            # Format commits info
            commits_info = ""
            if contributor_commits > 0:
                commits_info += f"+{contributor_commits}"
            if admin_commits > 0:
                if commits_info:
                    commits_info += f"/-{admin_commits}"
                else:
                    commits_info += f"-{admin_commits}"
            
            lines.append(
                f"| {contributor} | {score:.1f} | {status} | {total} | {doc_count} | {feat_count} | {fix_count} | {changes_count} | {commits_info} | {admins_str} |"
            )
        
        lines.extend(["", ""])
    
    lines.extend([
        "## Scoring System (0-10)",
        "",
        "### Components:",
        "- **Base Score**: 5.0 points",
        "- **Issue Completion** (0-3 points):",
        "  - 8+ issues: 3.0 points",
        "  - 5-7 issues: 2.0 points",
        "  - 2-4 issues: 1.0 point",
        "  - 1 issue: 0 points",
        "  - 0 issues: 0 points",
        "- **Quality** (0-2 points):",
        "  - 80%+ PRs without changes requested: 2.0 points",
        "  - 60-79% without changes: 1.5 points",
        "  - 40-59% without changes: 1.0 point",
        "  - 20-39% without changes: 0.5 points",
        "  - <20% without changes: 0 points",
        "- **Responsiveness Bonus/Penalty** (±0.3 points):",
        "  - **+0.3 points**: If contributor made commits to fix issues after admin requested changes",
        "  - **-0.3 points**: If admin had to make commits to fix issues and contributor did not respond",
        "  - *Note: Merge commits are excluded from this calculation*",
        "",
        "### Status Indicators:",
        "- **✅ Acceptable** (≥ 6.0): Meets performance threshold",
        "- **⚠️ Below Threshold** (< 6.0): Below acceptable performance level",
        "",
        "## Legend",
        "",
        "| Column | Description |",
        "|---|---|",
        "| **Score** | Overall performance score (0-10) |",
        "| **Status** | ✅ Acceptable or ⚠️ Below Threshold |",
        "| **Total Issues** | Number of issues assigned in the sprint |",
        "| **Documentation** | Issues labeled as documentation |",
        "| **Features** | Issues labeled as feature |",
        "| **Fixes** | Issues labeled as fix |",
        "| **Changes Requested** | Number of PRs where an admin requested changes |",
        "| **Commits After Review** | +X: commits by contributor / -X: commits by admin after changes requested |",
        "| **Admins** | Admins who requested changes (javpalgon, santiabregu, manumnzz, Glinbor10) |",
        "",
    ])
    
    return "\n".join(lines)


def main():
    token = os.getenv("GITHUB_TOKEN")
    repository = os.getenv("GITHUB_REPOSITORY")
    threshold_env = os.getenv("PERFORMANCE_THRESHOLD", "6.0")

    if not token:
        raise RuntimeError("Missing GITHUB_TOKEN environment variable.")
    if not repository or "/" not in repository:
        raise RuntimeError("Missing or invalid GITHUB_REPOSITORY (expected owner/repo).")

    try:
        threshold = float(threshold_env)
    except ValueError:
        print(f"Warning: Invalid PERFORMANCE_THRESHOLD '{threshold_env}', using default 6.0")
        threshold = 6.0

    owner, repo_name = repository.split("/", 1)
    gh = GitHubClient(token)

    now = datetime.now(timezone.utc)

    # Fetch all issues (including closed ones)
    print("Fetching issues...")
    issues_all = gh.get_paginated(
        f"/repos/{owner}/{repo_name}/issues",
        params={
            "state": "all",
            "sort": "updated",
            "direction": "desc",
        },
    )
    
    # Filter out PRs
    issues_all = [item for item in issues_all if "pull_request" not in item]

    # Group issues by sprint
    print(f"Found {len(issues_all)} issues. Grouping by sprint...")
    issues_by_sprint = defaultdict(list)
    
    for issue in issues_all:
        labels = issue.get("labels", [])
        sprint_num = extract_sprint_number(labels)
        
        if sprint_num is not None:
            issues_by_sprint[sprint_num].append(issue)

    if not issues_by_sprint:
        print("Warning: No issues with SPRINT labels found.")
    else:
        print(f"Found issues in {len(issues_by_sprint)} sprints.")

    # Calculate metrics
    print("Calculating metrics...")
    metrics = calculate_contributor_metrics(issues_by_sprint, gh, owner, repo_name)

    # Generate report
    print("Generating report...")
    os.makedirs("metrics", exist_ok=True)
    report = build_report(repository, now, metrics, threshold=threshold)
    
    with open("metrics/performance-metrics.md", "w", encoding="utf-8") as report_file:
        report_file.write(report)

    print("Generated performance metrics report at metrics/performance-metrics.md")
    print(f"Performance threshold: {threshold}/10")


if __name__ == "__main__":
    main()
