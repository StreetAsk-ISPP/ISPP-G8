# Individual Performance Metrics Guide

## Purpose
This document explains how individual metrics are calculated and how to run the workflow that generates the performance report.

## Workflow Execution
The Performance Metrics workflow supports two execution modes:

1. Manual execution (`workflow_dispatch`):
- You can run it at any time from GitHub Actions.
- You can provide optional inputs such as sprint number and score threshold.

2. Scheduled execution (`schedule`):
- It runs automatically every Tuesday at 13:00 (UTC).

## Scope of Analysis
- Metrics are computed by sprint, using issues tagged with `SPRINT X`.
- If a target sprint is provided manually, only that sprint is analyzed.
- If no sprint is provided, all detected sprints are analyzed.

## Issue Type Classification
Issue type is derived from the issue title prefix:

- `[FEATURE]` -> Feature
- `[DOCS]` -> Documentation
- `[BUG]` -> Fix
- Any other prefix -> Other (deliverables, presentation, etc)

## Issue Weights
Weighted issue effort is used in the score:

- Feature: 1.0
- Fix: 1.0
- Documentation: 0.7
- Other: 0.7

Weighted effort formula:

`weighted_issues = 1.0 * (feature + fix) + 0.7 * (documentation + other)`

## Score Formula (0-10)
If a contributor has 0 issues in the sprint:

`score = 0`

Otherwise:

`score = clamp(0, 10, 5.0 + issue_points + quality_points + responsiveness_points)`

Where:

- `issue_points` depends on weighted issues:
  - >= 8.0 -> 3.0
  - >= 5.0 and < 8.0 -> 2.0
  - >= 2.0 and < 5.0 -> 1.0
  - < 2.0 -> 0.0

- `quality_points` is based only on analyzed PRs:
  - >= 80% PRs without requested changes -> 2.0
  - >= 60% and < 80% -> 1.5
  - >= 40% and < 60% -> 1.0
  - >= 20% and < 40% -> 0.5
  - < 20% -> 0.0
  - If no PR is analyzed -> 0.0 (neutral)

- `responsiveness_points`:
  - +0.3 if the PR author made follow-up commits after admin change requests
  - -0.3 if admins had to make follow-up commits and the author did not respond
  - Merge commits are excluded from this part

## PR Attribution Rules
- PR metrics are attributed to the PR creator (author), not to all issue assignees.
- PR links in the report represent PRs created by that contributor.
- Admin review data includes admin reviewers assigned to or reviewing those PRs.

## Extraordinary Situations and Administrative Penalties
In exceptional situations not fully captured by automated metrics (for example, when someone abandons an assigned issue), admins may apply additional penalties according to project governance and team judgment.
