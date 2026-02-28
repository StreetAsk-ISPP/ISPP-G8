import json
import os
import subprocess
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API_BASE = "https://api.github.com"
LOOKBACK_DAYS = 30
WEEK_DAYS = 7


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
            "User-Agent": "agile-metrics-bot",
        }

        attempts = 0
        while attempts < 5:
            attempts += 1
            req = Request(url, data=body, headers=headers, method=method)
            try:
                with urlopen(req, timeout=60) as response:
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

    def post(self, path: str, payload: dict):
        data, _ = self._request("POST", path, payload=payload)
        return data



def parse_dt(value: str | None):
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))



def classify_lead_time(days: float):
    if days <= 3:
        return "🟢 Good", "<= 3 days"
    if days <= 5:
        return "🟡 Acceptable", "3-5 days"
    return "🔴 Poor", "> 5 days"



def classify_throughput(value: float):
    if value >= 8:
        return "🟢 Good", ">= 8-12 issues/week"
    if value >= 5:
        return "🟡 Acceptable", "5-8 issues/week"
    return "🔴 Low", "< 5 issues/week"



def classify_wip(max_active: int):
    if max_active <= 2:
        return "🟢 Good", "max 1-2 active issues/person"
    if max_active == 3:
        return "🟡 At risk", "3 active issues/person"
    return "🔴 Poor", "> 3 active issues/person"



def classify_review_time(hours: float):
    if hours < 48:
        return "🟢 Good", "< 48h"
    if hours < 72:
        return "🟡 Acceptable", "< 72h"
    return "🔴 Poor", "> 3 days"



def classify_assignment(unassigned_pct: float):
    if unassigned_pct == 0:
        return "🟢 Good", "100% assigned"
    if unassigned_pct > 5:
        return "🔴 Poor", "> 5% unassigned"
    return "🟡 Acceptable", "<= 5% unassigned"



def classify_ratio(ratio: float):
    if ratio >= 1:
        return "🟢 Good", ">= 1"
    return "🔴 Poor", "< 1"



def run_git_command(args: list[str]):
    completed = subprocess.run(args, check=False, capture_output=True, text=True)
    if completed.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(args)}\n{completed.stderr}")
    return completed.stdout.strip()



def commit_and_push_report():
    run_git_command(["git", "config", "user.name", "github-actions[bot]"])
    run_git_command(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])
    run_git_command(["git", "add", "metrics/metrics-report.md"])

    diff_check = subprocess.run(["git", "diff", "--cached", "--quiet"], check=False)
    if diff_check.returncode == 0:
        print("No report changes detected. Skipping commit/push.")
        return False

    run_git_command(["git", "commit", "-m", "chore(metrics): update weekly agile metrics report"])
    run_git_command(["git", "push"])
    print("Metrics report committed and pushed.")
    return True



def build_report(repo: str, generated_at: datetime, metrics_rows: list[tuple[str, str, str, str]]):
    lines = [
        "# Agile Metrics Report",
        "",
        f"- Repository: `{repo}`",
        f"- Generated at (UTC): `{generated_at.strftime('%Y-%m-%d %H:%M:%S')}`",
        f"- Lookback window: last `{LOOKBACK_DAYS}` days (weekly metrics use last `{WEEK_DAYS}` days)",
        "",
        "| Metric | Value | Status | Threshold |",
        "|---|---:|---|---|",
    ]

    for metric_name, value, status, threshold in metrics_rows:
        lines.append(f"| {metric_name} | {value} | {status} | {threshold} |")

    lines.extend(
        [
            "",
            "## Theoretical Justification",
            "",
            "Thresholds are defined based on agile principles (Scrum/Kanban) and standard DevOps metrics, adapted to team size (20 members) and academic environment.",
            "",
        ]
    )

    return "\n".join(lines)



def main():
    token = os.getenv("GITHUB_TOKEN")
    repository = os.getenv("GITHUB_REPOSITORY")
    team_size = int(os.getenv("TEAM_SIZE", "20"))

    if not token:
        raise RuntimeError("Missing GITHUB_TOKEN environment variable.")
    if not repository or "/" not in repository:
        raise RuntimeError("Missing or invalid GITHUB_REPOSITORY (expected owner/repo).")

    owner, repo_name = repository.split("/", 1)
    gh = GitHubClient(token)

    now = datetime.now(timezone.utc)
    since_30 = now - timedelta(days=LOOKBACK_DAYS)
    since_7 = now - timedelta(days=WEEK_DAYS)

    issues_all = gh.get_paginated(
        f"/repos/{owner}/{repo_name}/issues",
        params={
            "state": "all",
            "since": since_30.isoformat(),
            "sort": "updated",
            "direction": "desc",
        },
    )
    issues_all = [item for item in issues_all if "pull_request" not in item]

    issues_open = gh.get_paginated(
        f"/repos/{owner}/{repo_name}/issues",
        params={
            "state": "open",
            "sort": "updated",
            "direction": "desc",
        },
    )
    issues_open = [item for item in issues_open if "pull_request" not in item]

    closed_issues_recent = [
        issue for issue in issues_all if issue.get("state") == "closed" and parse_dt(issue.get("closed_at"))
    ]

    lead_times = []
    closed_in_week_count = 0
    for issue in closed_issues_recent:
        created = parse_dt(issue.get("created_at"))
        closed = parse_dt(issue.get("closed_at"))
        if not created or not closed:
            continue
        lead_days = (closed - created).total_seconds() / 86400
        lead_times.append(lead_days)
        if closed >= since_7:
            closed_in_week_count += 1

    avg_lead_days = sum(lead_times) / len(lead_times) if lead_times else 0.0
    lead_status, lead_threshold = classify_lead_time(avg_lead_days)

    throughput_value = float(closed_in_week_count)
    throughput_status, throughput_threshold = classify_throughput(throughput_value)

    active_by_assignee = defaultdict(int)
    assigned_open_count = 0
    for issue in issues_open:
        assignees = issue.get("assignees") or []
        if assignees:
            assigned_open_count += 1
        for assignee in assignees:
            login = assignee.get("login")
            if login:
                active_by_assignee[login] += 1

    max_active = max(active_by_assignee.values(), default=0)
    avg_active_team = sum(active_by_assignee.values()) / team_size if team_size > 0 else 0.0
    wip_status, wip_threshold = classify_wip(max_active)

    unassigned_open = len(issues_open) - assigned_open_count
    unassigned_pct = (unassigned_open / len(issues_open) * 100) if issues_open else 0.0
    assigned_pct = 100.0 - unassigned_pct if issues_open else 100.0
    assignment_status, assignment_threshold = classify_assignment(unassigned_pct)

    pulls_closed = gh.get_paginated(
        f"/repos/{owner}/{repo_name}/pulls",
        params={
            "state": "closed",
            "sort": "updated",
            "direction": "desc",
        },
    )

    pulls_recent = []
    for pr in pulls_closed:
        closed = parse_dt(pr.get("closed_at"))
        if closed and closed >= since_30:
            pulls_recent.append(pr)

    review_hours = []
    for pr in pulls_recent:
        pr_created = parse_dt(pr.get("created_at"))
        if not pr_created:
            continue
        reviews = gh.get_paginated(f"/repos/{owner}/{repo_name}/pulls/{pr['number']}/reviews")
        submitted_times = [parse_dt(r.get("submitted_at")) for r in reviews if r.get("submitted_at")]
        submitted_times = [t for t in submitted_times if t is not None]
        if not submitted_times:
            continue
        first_review = min(submitted_times)
        delta_hours = (first_review - pr_created).total_seconds() / 3600
        if delta_hours >= 0:
            review_hours.append(delta_hours)

    avg_review_hours = sum(review_hours) / len(review_hours) if review_hours else 0.0
    review_status, review_threshold = classify_review_time(avg_review_hours)

    search_open = gh.get(
        "/search/issues",
        params={"q": f"repo:{owner}/{repo_name} is:issue is:open", "per_page": 1},
    )
    search_closed = gh.get(
        "/search/issues",
        params={"q": f"repo:{owner}/{repo_name} is:issue is:closed", "per_page": 1},
    )

    total_open = int(search_open.get("total_count", 0))
    total_closed = int(search_closed.get("total_count", 0))
    closed_open_ratio = (total_closed / total_open) if total_open > 0 else float(total_closed)
    ratio_status, ratio_threshold = classify_ratio(closed_open_ratio)

    metrics_rows = [
        (
            "Lead Time (Done Issues)",
            f"{avg_lead_days:.2f} days (n={len(lead_times)})",
            lead_status,
            lead_threshold,
        ),
        (
            "Throughput",
            f"{closed_in_week_count} closed issues/week",
            throughput_status,
            throughput_threshold,
        ),
        (
            "WIP (Active Issues per Assignee)",
            f"max {max_active}, avg/team {avg_active_team:.2f}",
            wip_status,
            wip_threshold,
        ),
        (
            "Average PR Review Time",
            f"{avg_review_hours:.2f}h (n={len(review_hours)})",
            review_status,
            review_threshold,
        ),
        (
            "% Issues with Assignee",
            f"{assigned_pct:.2f}% assigned ({unassigned_pct:.2f}% unassigned)",
            assignment_status,
            assignment_threshold,
        ),
        (
            "Closed / Open Issues Ratio",
            f"{closed_open_ratio:.2f} (closed={total_closed}, open={total_open})",
            ratio_status,
            ratio_threshold,
        ),
    ]

    os.makedirs("metrics", exist_ok=True)
    report = build_report(repository, now, metrics_rows)
    with open("metrics/metrics-report.md", "w", encoding="utf-8") as report_file:
        report_file.write(report)

    print("Generated metrics report at metrics/metrics-report.md")

    try:
        commit_and_push_report()
    except Exception as err:
        raise RuntimeError(f"Report was generated but commit/push failed: {err}") from err


if __name__ == "__main__":
    main()
