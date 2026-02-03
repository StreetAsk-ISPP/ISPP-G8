# Definition of Done

The Definition of Done is a formal agreement within a development team that specifies the quality requirements and activities that a user story or task must satisfy before it is considered complete.

## Global "Done" Checklist
For a task to be marked as **Done**, it must meet the following criteria:

### Documentation Requirements 
- **Technical Accuracy:** All diagrams and descriptions accurately reflect the current state of the project.
- **Grammar & Style:** The document is free of spelling errors.
- **Standard Format:** Files are saved in the agreed format (normally `.md`).
- **Accessibility:** The document is uploaded to the central repository (`/docs` folder) and is accessible to all team members.

### Software Development (Code)
- **Unit Tests:** New logic is covered by unit tests, and all existing tests pass.
- **Functional Testing:** The feature has been manually verified to meet the User Story requirements.
- **Formal Approval:** The Pull Request must have at least one **Approve** vote from a peer.
- **Comment Resolution:** All "Request Changes" or suggestions made during the review process must be addressed and marked as resolved in the PR thread.
- **Audit Trail:** The PR description must link to the relevant task/issue, ensuring a clear link between the requirement and the reviewed code.
- **Merge:** Code is merged into the main/develop branch only after the PR status check turns green.
