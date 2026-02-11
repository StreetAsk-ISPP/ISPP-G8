# Definition of Done

The Definition of Done is a formal agreement within a development team that specifies the quality requirements and activities that a user story or task must satisfy before it is considered complete.

## Global "Done" Checklist
For a task to be marked as **Done**, it must meet the following criteria:

### Documentation Requirements 

- **Technical Accuracy:** All diagrams and descriptions accurately reflect the current state of the project.

- **Grammar & Style:** The document is free of spelling errors.

- **Standard Format:** Files are saved in the agreed format (normally `.md`).

- **Accessibility:** The document is uploaded to the central repository (`/docs` folder) and is accessible to all team members.

## Software Development (Code)

- **Unit Tests:**  
  All new logic must be covered by unit tests.  
  All existing tests must pass before pushing code.

- **Functional Testing:**  
  Functionality must be manually verified in the local environment to ensure it meets the User Story requirements before merging.

- **Self-Review:**  
  Before merging, the author must review their own changes to ensure:
  - code clarity,
  - absence of unnecessary code,
  - compliance with project standards.

- **Stability Gate:**  
  Code must never be merged if there are:
  - failing tests,
  - unvalidated functionality,
  - or incomplete work.
