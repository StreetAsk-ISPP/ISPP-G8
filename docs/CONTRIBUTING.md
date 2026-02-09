# Contributing Guide

Thank you for contributing to this project! Please follow this workflow to implement changes.

## Setup (One Time)

Configure Git to use our commit message template. This file (`.gitmessage`) is already in the repository and contains instructions and examples for writing commits following our conventions.

Run this command **once** in your local repository:

```bash
git config commit.template .gitmessage
```

This tells Git to show the `.gitmessage` template every time you run `git commit`. You don't need to do anything else - Git will automatically use it.

### How it works

When you run `git commit` (without `-m`):
1. Your default editor will open with the `.gitmessage` template
2. The template shows the format and examples
3. You write your commit message following the template
4. Save and close the editor
5. Your commit is created

The template includes helpful comments explaining:
- What commit types are allowed (feat, fix, docs)
- How to write a clear title
- How to write a detailed description

## Commit Message Format

All commits must follow the conventional commit format:

```
<type>: <title>

<description>
```

**Types allowed:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes

**Example:**
```
feat: add user authentication

Implement JWT-based authentication with login and logout endpoints
```

## Development Workflow

### 1. Creating a Branch

Create a branch based on the issue type:

#### Feature Issue (type: enhancement)
```bash
git checkout -b feature/<issue-name>
```
Example: `feature/user-authentication`

#### Documentation Issue (type: documentation)
```bash
git checkout -b document/<issue-name>
```
Example: `document/api-documentation`

#### Bug Issue (type: bug) - Hotfixes
Work directly on the shared `bugfix` branch:
```bash
git checkout bugfix
git pull origin bugfix
```
Example: Fix a critical production issue

### 2. Development

- Create commits using the template
- Push your changes regularly
- Keep your branch up to date with `trunk`

### 3. Pull Request to trunk (Pre-production)

When your feature/documentation is ready:

1. Push your branch
2. Open a Pull Request from your branch to `trunk`
3. Set one reviewer: Javi, Miguel, Santia, or Guillermo
4. Wait for review and CI/CD checks
5. The reviewer merges the PR and deletes the branch

**Visual example:**
```
feature/my-task  ──PR──>  trunk  ──(admins when ready)──>  main
                 reviewer: Javi | Miguel | Santia | Guillermo
```

**Branch Cleanup:**
- `feature/*` branches are **deleted** after merge to `trunk` by admins
- `document/*` branches are **deleted** after merge to `trunk` by admins
- `bugfix` branch is **permanent** for hotfixes

### 4. Merging to main (Production)

When the feature/documentation is complete and tested on `trunk`:

1. Administrators decide when to promote `trunk`
2. Administrators merge `trunk` to `main`
3. Tag the release if needed

## Branch Structure

```
main (production)
  ├── trunk (pre-production)
  │   ├── feature/user-auth (→ deleted after merge)
  │   ├── feature/payment-integration (→ deleted after merge)
  │   ├── document/api-docs (→ deleted after merge)
  │   └── bugfix (→ permanent hotfix branch)
  └── bugfix (permanent hotfix branch)
```

## Important Notes

- Always pull the latest changes before starting work
- Keep commits small and focused
- Write clear commit messages
- Test locally before pushing
- Don't push directly to `trunk` or `main`
- Use the shared `bugfix` branch for all hotfixes (pull latest before starting)
- Never create individual `bugfix/` branches; use the main `bugfix` branch

## Example: Contributing a Feature

Here's a step-by-step example of how to implement a feature:

### 1. Pull latest from trunk
```bash
git checkout trunk
git pull origin trunk
```

### 2. Create feature branch
```bash
git checkout -b feature/add-user-profile
```

### 3. Make your changes and commit

Make changes to your files, then:

```bash
git add .
git commit
```

This will open your editor with the commit template. Fill it in:

```
feat: add user profile page

Add a new user profile page that displays user information including
name, email, and profile picture. Users can edit their profile information
from this page.
```

### 4. Push your branch
```bash
git push origin feature/add-user-profile
```

### 5. Open PR to trunk

After verification:

1. Open a Pull Request from `feature/add-user-profile` to `trunk`
2. Add one reviewer: Javi, Miguel, Santia, or Guillermo
3. Wait for approval and CI/CD checks
4. The reviewer merges the PR and deletes the branch

### 6. Merge to main (when ready)

When the feature is fully tested and complete:

Administrators will decide when to merge `trunk` to `main`.

Tag the release if needed:
```bash
git tag v1.0.0
git push origin v1.0.0
```

<<<<<<< HEAD
### Alternative: Cherry-pick Individual Commits to main

If there are changes in `trunk` that are not yet ready for production according to their authors, you can use `cherry-pick` to push only your finished commits to `main` without bringing everything from `trunk`.

**When to use this:**
- Your change is complete and tested
- Other changes in `trunk` are not ready for `main`
- You need to deploy your change independently

**Steps:**

1. Ensure your change is merged to `trunk`
2. Switch to `main` and sync:
```bash
git checkout main
git reset --hard origin/main
```

3. Apply only your commit:
```bash
git cherry-pick <your-commit-hash>
```

4. Push to `main`:
```bash
git push origin main
```

**Note:** This should be used selectively. The standard workflow is to merge `trunk` completely to `main` when it's stable and ready.

## Requirements for Features

All new features must:

1. **Include unit tests** - Write tests covering the new functionality
2. **Pass all tests** - All tests must pass before pushing changes
3. **Follow the commit format** - Use the conventional commit template
4. **Be tested locally** - Verify functionality works before merging

## Testing Before Push

```bash
# Run all tests
npm test
# or
python -m pytest

# Run specific test file
npm test -- feature.test.js
# or
python -m pytest tests/test_feature.py
```

If tests fail, fix the issues and commit again. Do NOT push failing tests.

=======
>>>>>>> e2cf1711420deb6704bbb03c8e81d3b5fd668899
**Don't use `-m` flag**, let the template guide you:

```bash
# ✅ Good - uses template
git commit

# ❌ Avoid - skips template
git commit -m "add user profile"
```

## Questions?

If you have questions about the workflow, ask in the team communication channel or create a documentation issue.
