# Tecnological Stack

## 1: Backend Development

## 2: Frontend Development

## 3: Backend & Database Deployment 

### 3.1: Cloud Provider Selection: Why Azure?

The decision to utilize **Microsoft Azure** as our cloud infrastructure is driven by a strategic resource advantage:

* **University of Seville Partnership:** The University of Seville is an active beneficiary of the **Azure for Students** program. Only the following regions are available ("spaincentral","switzerlandnorth","italynorth","germanywestcentral","polandcentral").
* **Cost Efficiency:** This partnership grants us access to **$100 in annual credits** and free tier services for 12 months. This allows the team to deploy enterprise-grade architecture (PaaS and Serverless) without incurring out-of-pocket expenses during the development and initial production phases.
* **Professional Certification:** Developing on Azure aligns with industry standards, offering the team experience with tools widely used in the corporate sector (PostgreSQL on Azure, GitHub Actions).

---

### 3.2: Architecture Selection: Option 3 (Winner)

We evaluated three potential architectures. We have selected **Option 3: Azure Container Apps** as the optimal balance between modernity, cost (covered by student credits), and performance.

| Architecture | Description | Verdict |
| --- | --- | --- |
| **Azure App Service** | Traditional PaaS for hosting web apps. | **Discarded.** While simple, it lacks the flexibility of container orchestration and can be more expensive to scale vertically. |
| **Azure Spring Apps** | Managed service specifically for Spring Boot. | **Discarded.** The base cost is too high, consuming our student credits too quickly for a single microservice. |
| **Azure Container Apps** | **Serverless Containers (Kubernetes-based).** | **WINNER.** It allows us to run **Docker containers** natively. It supports **scaling to zero** (saving credits when the app is not in use) and provides a production-ready environment similar to Kubernetes but without the management overhead. |

---

### 3.3: The Deployment Pipeline (CI/CD)

We will automate the delivery of both the Database and the Backend Code using **GitHub Actions**. Manual deployments are restricted to the initial infrastructure setup.

#### A. The Database: Azure Database for PostgreSQL

We will use the **Flexible Server** deployment option.

* **Provisioning:** We will provision the instance via the Azure Portal (using student credits).
* **Security:** The database will be configured inside a Virtual Network (VNet) or with firewall rules that **only** allow connections from our Container App and the developers' specific IP addresses for debugging.
* **Schema Management:** We will not run SQL scripts manually. The Spring Boot application will include **Flyway** (or Liquibase) to automatically migrate the database schema (create tables, add columns) every time the application starts.

#### B. The Backend: Source Code to Container

The Continuous Deployment (CD) pipeline will function as follows:

1. **Trigger:** Developer pushes code to the `main` branch.
2. **Build (CI):** GitHub Actions creates a runner, checks out the code, and runs `mvn clean package` to test and build the JAR file.
3. **Dockerize:** The Action builds a Docker image using our `Dockerfile`.
4. **Registry:** The image is pushed to **Azure Container Registry (ACR)**.
5. **Deploy (CD):** The Action triggers a revision update in **Azure Container Apps**, pulling the new image from ACR and restarting the container gracefully.

---

### 3.4: Risk Assessment & Mitigation

Deploying a cloud-native application under an academic license involves specific risks.

| Risk | Impact | Mitigation Strategy |
| --- | --- | --- |
| **Credit Exhaustion** | If the $100 student credit runs out, services will stop immediately. | **Budget Alerts:** We will configure "Cost Alerts" in Azure to notify us when we reach 50% and 80% of the credit limit. We will use "B-series" (Burstable) compute instances which are the cheapest. |
| **Cold Starts** | Azure Container Apps "scales to zero" to save money. The first user might wait 10+ seconds for the backend to wake up. | **Acceptance:** For a student project/MVP, this is an acceptable trade-off to save credits. If needed for a demo, we can set `minReplicas=1` temporarily. |
| **Data Loss** | Accidental deletion of the database resource. | **Backups:** Azure PostgreSQL Flexible Server includes automatic backups (7-day retention). We will also enable "Resource Locks" in the Azure Portal to prevent accidental deletion. |
| **Vendor Lock-in** | Difficulty migrating if we lose University access. | **Docker Strategy:** Since the entire backend is dockerized and the DB is standard PostgreSQL, we can migrate to AWS, Google Cloud, or a local server in less than 2 hours by simply moving the container image and dumping the SQL data. |

---

## 4: Frontend Deployment

## 5: Team and Software Management 
