import json
import os
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

    def post(self, path: str, payload: dict):
        data, _ = self._request("POST", path, payload=payload)
        return data


class CodacyClient:
    def __init__(self, token: str | None):
        self.token = token

    def get_quality_metrics(self, provider: str, org: str, repo: str):
        """
        Fetch Codacy metrics for repository-level quality indicators.

        TODO: API CALL
        Endpoint candidate (Codacy API v3, adjust to your Codacy account type):
          GET https://api.codacy.com/api/v3/analysis/organizations/{provider}/{org}/repositories/{repo}
        Extract from JSON response (or nested endpoints if your tenant differs):
          - quality gate pass rate (% of successful quality checks)
          - duplication in new code (%)
          - coverage on new/changed code (%)
          - open security issues (critical/high)

        Notes:
          - Some Codacy plans expose these values in dedicated endpoints for pull requests/commits.
          - If your workspace uses Codacy Cloud or Self-hosted, endpoint path may vary.
        """
        if not self.token:
            return None

        query = urlencode({"provider": provider, "organization": org, "repository": repo})
        url = f"https://api.codacy.com/api/v3/repositories/quality?{query}"
        headers = {
            "Accept": "application/json",
            "api-token": self.token,
            "User-Agent": "agile-metrics-bot",
        }

        req = Request(url, headers=headers, method="GET")
        try:
            with urlopen(req, timeout=60) as response:  # nosec B310
                data = response.read().decode("utf-8")
                parsed = json.loads(data) if data else {}
                return {
                    "quality_gate_pass_rate": parsed.get("qualityGatePassRate"),
                    "duplication_new_code": parsed.get("duplicationInNewCode"),
                    "coverage_new_code": parsed.get("coverageOnNewCode"),
                    "open_security_critical_high": parsed.get("openSecurityIssuesCriticalHigh"),
                }
        except Exception:
            return None



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


def classify_codacy_quality_gate(pass_rate: float):
    if pass_rate >= 95:
        return "🟢 Good", ">= 95%"
    if pass_rate >= 85:
        return "🟡 Acceptable", "85-94%"
    return "🔴 Poor", "< 85%"


def classify_codacy_duplication(duplication_pct: float):
    if duplication_pct < 3:
        return "🟢 Good", "< 3%"
    if duplication_pct <= 5:
        return "🟡 Acceptable", "3-5%"
    return "🔴 Poor", "> 5%"


def classify_codacy_coverage(coverage_pct: float):
    if coverage_pct >= 80:
        return "🟢 Good", ">= 80%"
    if coverage_pct >= 70:
        return "🟡 Acceptable", "70-79%"
    return "🔴 Poor", "< 70%"


def classify_codacy_security(open_critical_high: int):
    if open_critical_high == 0:
        return "🟢 Good", "0"
    if open_critical_high == 1:
        return "🟡 Acceptable", "1"
    return "🔴 Poor", "> 1"


def classify_individual_throughput(closed_week: int, closed_prev_week: int):
    if closed_week >= 2:
        return "🟢 Good", ">= 2"
    if closed_week == 1:
        return "🟡 Acceptable", "= 1"
    if closed_week == 0 and closed_prev_week == 0:
        return "🔴 Poor", "= 0 for 2 consecutive weeks"
    return "🟡 Acceptable", "= 0 for 1 week"


def classify_individual_cycle_time(days: float):
    if days <= 4:
        return "🟢 Good", "<= 4 days"
    if days <= 7:
        return "🟡 Acceptable", "4-7 days"
    return "🔴 Poor", "> 7 days"


def classify_pr_merge_effectiveness(ratio_pct: float):
    if ratio_pct >= 80:
        return "🟢 Good", ">= 80%"
    if ratio_pct >= 60:
        return "🟡 Acceptable", "60-79%"
    return "🔴 Poor", "< 60%"


def classify_rework_rate(rework_pct: float):
    if rework_pct < 20:
        return "🟢 Good", "< 20%"
    if rework_pct <= 35:
        return "🟡 Acceptable", "20-35%"
    return "🔴 Poor", "> 35%"


def format_metric_value(value, suffix: str = ""):
    if value is None:
        return "N/A"
    if isinstance(value, float):
        return f"{value:.2f}{suffix}"
    return f"{value}{suffix}"


def pick_codacy_metrics_from_env():
    quality_gate_pass_rate = os.getenv("CODACY_QUALITY_GATE_PASS_RATE")
    duplication_new_code = os.getenv("CODACY_DUPLICATION_NEW_CODE")
    coverage_new_code = os.getenv("CODACY_COVERAGE_NEW_CODE")
    open_security_critical_high = os.getenv("CODACY_OPEN_SECURITY_CRITICAL_HIGH")

    return {
        "quality_gate_pass_rate": float(quality_gate_pass_rate) if quality_gate_pass_rate is not None else None,
        "duplication_new_code": float(duplication_new_code) if duplication_new_code is not None else None,
        "coverage_new_code": float(coverage_new_code) if coverage_new_code is not None else None,
        "open_security_critical_high": int(open_security_critical_high) if open_security_critical_high is not None else None,
    }


def resolve_team_members(
    gh: GitHubClient,
    owner: str,
    repo_name: str,
    issues_all: list[dict],
    pulls_all: list[dict],
    from_env: str | None,
):
    if from_env:
        members = [member.strip() for member in from_env.split(",") if member.strip()]
        if members:
            return sorted(set(members))

    discovered = set()
    for issue in issues_all:
        for assignee in issue.get("assignees") or []:
            login = assignee.get("login")
            if login:
                discovered.add(login)

    for pr in pulls_all:
        user = pr.get("user") or {}
        login = user.get("login")
        if login:
            discovered.add(login)

    # Include contributors with commits even if they never opened PRs/issues.
    # Endpoint:
    #   GET /repos/{owner}/{repo}/contributors
    # Note: anonymous contributors may not provide login and cannot be mapped to individual GitHub metrics.
    try:
        contributors = gh.get_paginated(
            f"/repos/{owner}/{repo_name}/contributors",
            params={"anon": "true"},
        )
        for contributor in contributors:
            login = contributor.get("login")
            if login:
                discovered.add(login)
    except RuntimeError:
        pass

    return sorted(discovered)


def get_issue_first_assigned_at(gh: GitHubClient, owner: str, repo_name: str, issue_number: int, login: str):
    """
    Returns first assignment timestamp of a specific user for an issue.

    TODO: API CALL
    Endpoint:
      GET /repos/{owner}/{repo}/issues/{issue_number}/events
    Extract:
      - first event with event == "assigned" and assignee.login == login
      - created_at as assignment timestamp
    """
    events = gh.get_paginated(f"/repos/{owner}/{repo_name}/issues/{issue_number}/events")
    assigned_times = []
    for event in events:
        if event.get("event") != "assigned":
            continue
        assignee = event.get("assignee") or {}
        if assignee.get("login") != login:
            continue
        assigned_at = parse_dt(event.get("created_at"))
        if assigned_at:
            assigned_times.append(assigned_at)
    return min(assigned_times) if assigned_times else None



def build_report(
    repo: str,
    generated_at: datetime,
    metrics_rows: list[tuple[str, str, str, str]],
    codacy_rows: list[tuple[str, str, str, str]],
    individual_rows: list[tuple[str, str, str, str]],
):
    lines = [
        "# Agile Metrics Report",
        "",
        f"- Repository: `{repo}`",
        f"- Generated at (UTC): `{generated_at.strftime('%Y-%m-%d %H:%M:%S')}`",
        f"- Lookback window: last `{LOOKBACK_DAYS}` days (weekly metrics use last `{WEEK_DAYS}` days)",
        "",
        "## A) Current Repository Metrics",
        "",
        "| Metric | Value | Status | Threshold |",
        "|---|---:|---|---|",
    ]

    for metric_name, value, status, threshold in metrics_rows:
        lines.append(f"| {metric_name} | {value} | {status} | {threshold} |")

    lines.extend(
        [
            "",
            "## B) Codacy Metrics (Repository Level)",
            "",
            "| Metric | Value | Status | Threshold |",
            "|---|---:|---|---|",
        ]
    )

    for metric_name, value, status, threshold in codacy_rows:
        lines.append(f"| {metric_name} | {value} | {status} | {threshold} |")

    lines.extend(
        [
            "",
            "## C) Individual Performance Metrics",
            "",
            "| Member | Metric | Value | Status | Threshold |",
            "|---|---|---:|---|---|",
        ]
    )

    for member, metric_name, value, status_threshold in individual_rows:
        status, threshold = status_threshold.split("||", 1)
        lines.append(f"| `{member}` | {metric_name} | {value} | {status} | {threshold} |")

    lines.extend(
        [
            "",
            "## Theoretical Justification",
            "",
            "Thresholds are defined based on agile principles (Scrum/Kanban) and standard DevOps metrics, adapted to team size and academic environment.",
            "",
            "Codacy metrics may require tenant-specific API endpoints. See TODO: API CALL comments in script.",
            "",
        ]
    )

    return "\n".join(lines)



def main():
    token = os.getenv("GITHUB_TOKEN")
    repository = os.getenv("GITHUB_REPOSITORY")
    team_size = int(os.getenv("TEAM_SIZE", "20"))
    team_members_env = os.getenv("TEAM_MEMBERS")

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

    pulls_all = gh.get_paginated(
        f"/repos/{owner}/{repo_name}/pulls",
        params={
            "state": "all",
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

    codacy_data = pick_codacy_metrics_from_env()

    codacy_token = os.getenv("CODACY_API_TOKEN")
    codacy_provider = os.getenv("CODACY_PROVIDER", "gh")
    codacy_org = os.getenv("CODACY_ORG")
    codacy_repo = os.getenv("CODACY_REPO", repo_name)

    if (
        codacy_data["quality_gate_pass_rate"] is None
        and codacy_data["duplication_new_code"] is None
        and codacy_data["coverage_new_code"] is None
        and codacy_data["open_security_critical_high"] is None
        and codacy_token
        and codacy_org
    ):
        codacy_client = CodacyClient(codacy_token)
        api_metrics = codacy_client.get_quality_metrics(codacy_provider, codacy_org, codacy_repo)
        if api_metrics:
            codacy_data.update(api_metrics)

    codacy_rows = []

    quality_gate = codacy_data.get("quality_gate_pass_rate")
    quality_status, quality_threshold = (
        classify_codacy_quality_gate(quality_gate) if quality_gate is not None else ("🔴 Poor", ">= 95%")
    )
    codacy_rows.append(
        (
            "Codacy Quality Gate Pass Rate",
            format_metric_value(quality_gate, "%"),
            quality_status,
            quality_threshold,
        )
    )

    duplication = codacy_data.get("duplication_new_code")
    duplication_status, duplication_threshold = (
        classify_codacy_duplication(duplication) if duplication is not None else ("🔴 Poor", "< 3%")
    )
    codacy_rows.append(
        (
            "Duplication in New Code",
            format_metric_value(duplication, "%"),
            duplication_status,
            duplication_threshold,
        )
    )

    coverage_new = codacy_data.get("coverage_new_code")
    coverage_status, coverage_threshold = (
        classify_codacy_coverage(coverage_new) if coverage_new is not None else ("🔴 Poor", ">= 80%")
    )
    codacy_rows.append(
        (
            "Coverage on New/Changed Code",
            format_metric_value(coverage_new, "%"),
            coverage_status,
            coverage_threshold,
        )
    )

    security_open = codacy_data.get("open_security_critical_high")
    security_status, security_threshold = (
        classify_codacy_security(security_open) if security_open is not None else ("🔴 Poor", "0")
    )
    codacy_rows.append(
        (
            "Open Security Issues (Critical/High)",
            format_metric_value(security_open),
            security_status,
            security_threshold,
        )
    )

    members = resolve_team_members(gh, owner, repo_name, issues_all, pulls_all, team_members_env)
    individual_rows: list[tuple[str, str, str, str]] = []

    issues_closed_since_14 = []
    since_14 = now - timedelta(days=14)
    for issue in issues_all:
        if issue.get("state") != "closed":
            continue
        closed_at = parse_dt(issue.get("closed_at"))
        if closed_at and closed_at >= since_14:
            issues_closed_since_14.append(issue)

    issues_closed_since_30 = []
    for issue in issues_all:
        if issue.get("state") != "closed":
            continue
        closed_at = parse_dt(issue.get("closed_at"))
        if closed_at and closed_at >= since_30:
            issues_closed_since_30.append(issue)

    pulls_recent_all = []
    for pr in pulls_all:
        created_at = parse_dt(pr.get("created_at"))
        if created_at and created_at >= since_30:
            pulls_recent_all.append(pr)

    for member in members:
        closed_week = 0
        closed_prev_week = 0
        member_cycle_days = []

        for issue in issues_closed_since_14:
            closed_at = parse_dt(issue.get("closed_at"))
            if not closed_at:
                continue

            assignees = issue.get("assignees") or []
            assignee_logins = {assignee.get("login") for assignee in assignees if assignee.get("login")}
            if member not in assignee_logins:
                continue

            if closed_at >= since_7:
                closed_week += 1
            elif (now - timedelta(days=14)) <= closed_at < since_7:
                closed_prev_week += 1

        throughput_status, throughput_threshold = classify_individual_throughput(closed_week, closed_prev_week)
        individual_rows.append(
            (
                member,
                "Individual Throughput",
                f"{closed_week} closed issues/week (prev={closed_prev_week})",
                f"{throughput_status}||{throughput_threshold}",
            )
        )

        for issue in issues_closed_since_30:
            number = issue.get("number")
            closed_at = parse_dt(issue.get("closed_at"))
            if not number or not closed_at:
                continue

            assignees = issue.get("assignees") or []
            assignee_logins = {assignee.get("login") for assignee in assignees if assignee.get("login")}
            if member not in assignee_logins:
                continue

            assigned_at = get_issue_first_assigned_at(gh, owner, repo_name, number, member)
            if not assigned_at:
                created_at = parse_dt(issue.get("created_at"))
                assigned_at = created_at

            if assigned_at and closed_at >= assigned_at:
                member_cycle_days.append((closed_at - assigned_at).total_seconds() / 86400)

        avg_cycle_days = sum(member_cycle_days) / len(member_cycle_days) if member_cycle_days else None
        if avg_cycle_days is None:
            cycle_value = "N/A (n=0)"
            cycle_status = "⚪ N/A"
            cycle_threshold = "Insufficient data"
        else:
            cycle_status, cycle_threshold = classify_individual_cycle_time(avg_cycle_days)
            cycle_value = f"{avg_cycle_days:.2f} days (n={len(member_cycle_days)})"
        individual_rows.append(
            (
                member,
                "Individual Cycle Time",
                cycle_value,
                f"{cycle_status}||{cycle_threshold}",
            )
        )

        opened_by_member = [pr for pr in pulls_recent_all if (pr.get("user") or {}).get("login") == member]
        opened_prs = len(opened_by_member)
        merged_prs = sum(1 for pr in opened_by_member if parse_dt(pr.get("merged_at")))
        if opened_prs == 0:
            merge_value = "N/A (opened=0)"
            merge_status = "⚪ N/A"
            merge_threshold = "Insufficient data"
        else:
            merge_effectiveness = merged_prs / opened_prs * 100
            merge_status, merge_threshold = classify_pr_merge_effectiveness(merge_effectiveness)
            merge_value = f"{merge_effectiveness:.2f}% (merged={merged_prs}, opened={opened_prs})"
        individual_rows.append(
            (
                member,
                "PR Merge Effectiveness",
                merge_value,
                f"{merge_status}||{merge_threshold}",
            )
        )

        prs_with_rework = 0
        total_prs_for_rework = 0
        for pr in opened_by_member:
            pr_number = pr.get("number")
            if not pr_number:
                continue

            total_prs_for_rework += 1
            reviews = gh.get_paginated(f"/repos/{owner}/{repo_name}/pulls/{pr_number}/reviews")
            review_rounds = [review for review in reviews if review.get("submitted_at")]
            if len(review_rounds) >= 2:
                prs_with_rework += 1

        if total_prs_for_rework == 0:
            rework_value = "N/A (total_prs=0)"
            rework_status = "⚪ N/A"
            rework_threshold = "Insufficient data"
        else:
            rework_rate = prs_with_rework / total_prs_for_rework * 100
            rework_status, rework_threshold = classify_rework_rate(rework_rate)
            rework_value = f"{rework_rate:.2f}% (>=2 rounds: {prs_with_rework}/{total_prs_for_rework})"
        individual_rows.append(
            (
                member,
                "Rework Rate",
                rework_value,
                f"{rework_status}||{rework_threshold}",
            )
        )

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
    report = build_report(repository, now, metrics_rows, codacy_rows, individual_rows)
    with open("metrics/metrics-report.md", "w", encoding="utf-8") as report_file:
        report_file.write(report)

    print("Generated metrics report at metrics/metrics-report.md")


if __name__ == "__main__":
    main()
