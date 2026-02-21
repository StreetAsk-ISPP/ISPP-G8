# Deployment & Workflow Guide (Trunk-based)

## 1. Render Configuration

To ensure persistence for each delivery, we will manage two types of services:

**Production Service:**
- **Name:** `frontend-prod`
- **Branch:** `main`
- **Auto-deploy:** ON (to always reflect the latest stable version)

**Per-Sprint Service (Persistent):**
- For each sprint closure, a new Static Site is created in Render.
- **Name:** `frontend-sprint-XX`
- **Branch:** `release/sprint-XX`
- **Auto-deploy:** ON (allows automatic fixes on the sprint version)


## 2. Daily Development Workflow (CI)

All work is integrated into the main development branch:

1. Create a task branch (`feature/...` or `fix/...`) from trunk.
2. Open a Pull Request (PR) toward `trunk`.
3. Once the tests (Frontend CI) pass and the merge is done, `trunk` becomes the current sprint integration.


## 3. Sprint Closure & Automation

When the sprint ends, the version is persisted:

**Creating the Release:** The `release/sprint-XX` branch is generated from `trunk` 

**Render Persistence:** The `frontend-sprint-XX` service is linked to its corresponding branch so the URL becomes permanent.


## 4. Promotion to Production

Once the sprint version is validated, the production environment is updated:

1. Open a PR from `release/sprint-XX` to `main`.
2. After the merge, the `frontend-prod` service automatically deploys the new official version.