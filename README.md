# Digital Subsidy & Grant Administration Platform (Group 1)

Unified full-stack government subsidy and grant administration platform connecting citizens, field verifiers, sanction authorities, and system administrators.

---

## 📁 Project Directory Structure

```
Digital-Subsidy-Grant-Administration-Platform-Group-1/
├── backend/                  <-- Spring Boot 3.2.5 REST API Backend
│   ├── pom.xml               <-- Maven project configuration
│   ├── mvnw.cmd / mvnw       <-- Self-contained Maven Wrapper (no global maven required)
│   ├── schema.sql            <-- Database schema definitions
│   └── src/                  <-- Controllers, Services, Models, Repositories, DTOs
├── frontend/                 <-- React 19 + Vite Frontend Application
│   ├── package.json          <-- Frontend npm dependencies
│   ├── vite.config.js        <-- Vite configuration with /api backend proxy
│   ├── tailwind.config.js    <-- Tailwind CSS styling tokens
│   ├── index.html            <-- HTML entry point
│   └── src/                  <-- React components, 5 new features, context, and ApiService
├── run.bat                   <-- Single-click runner (starts both backend & frontend)
├── run-backend.bat           <-- Starts backend only (port 8080)
├── run-frontend.bat          <-- Starts frontend only (port 5173)
└── README.md                 <-- Full documentation & execution instructions
```

---

## 🌟 Features & Enhancements Included
1. **Public Scheme Transparency Portal**: Completely unauthenticated exploration page with real-time status badges ("Applications Open"), search, multi-faceted filtering, dynamic processing time, and dynamic Last Updated dates.
2. **Save Scheme (Wishlist)**: Tag-based scheme bookmarking (🏷️ Save Scheme) with strict authenticated user isolation. Prompts unauthenticated citizens to sign in before saving.
3. **Clean Action Layout**: Compact scheme cards with `🏷️ Save Scheme` followed by `[ View Details ]` and single `[ Apply Now ]`. Complete eligibility criteria and required documents dossiers are accessible inside the View Details modal.
4. **Smart Eligibility Screener**: Unbiased eligibility evaluator starting with empty manual inputs for Age and Annual Income, strict validation, and informative eligibility status without duplicate apply buttons.
5. **Processing Time Estimator**: Dynamically calculated turnaround from actual application submission date and scheme duration, stage-by-stage pipeline timeline, and delay alerts.
6. **Re-Application / Renewal**: Seamless renewal flow with pre-populated details clearly tagged "From Previous Application", document dossier audit, and one-click submission.

---

## 🚀 How to Run the Platform

### Option 1: Single-Click Launch (Recommended)
Double-click **`run.bat`** in this folder:
- Automatically starts Spring Boot on `http://localhost:8080` (with H2 database and seeded demo data).
- Installs npm packages if needed and launches the web portal on `http://localhost:5173`.

### Option 2: Manual Launch

#### 1. Backend (Spring Boot 3.2.5)
```bash
cd backend
mvnw.cmd spring-boot:run
```
- API Base: `http://localhost:8080/api`
- Swagger UI docs: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/subsidydb`, Username: `sa`, Password: *blank*)

#### 2. Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173/`

---

## 👥 Official Role Credentials
| Role | Email | Password | Scope / Permissions |
|---|---|---|---|
| **Field Officer** | `sahana@gmail.com` | `sahana$45` | Inspect submitted applications, verify documents & field scrutiny |
| **District Nodal Officer** | `kavitha@gmail.com` | `kavitha$123` | Scrutinize taluk units, endorse district quotas & forward to State Directorate |
| **Sanction Authority** | `mayur@gmail.com` | `mayur%34` | Review verified applications, authorize & sanction DBT grants |
| **Chief Administrator** | `sachin@gmail.com` | `sachin` | System governance, analytics, audit logs, scheme management |
| **Citizen / Beneficiary** | `applicant@gov.in` | `password123` | Browse schemes, save schemes, submit applications, renewals, live tracking |
| **Public / Logged-Out** | *No Login Required* | *N/A* | Public Scheme Transparency Portal, explore schemes, view details & criteria |

---

## 🛠️ Technology Stack
- **Backend**: Java 17, Spring Boot 3.2.5, Spring Data JPA, Spring Security (JWT HS512), H2 Database, Maven Wrapper
- **Frontend**: React 19, Vite 8, Tailwind CSS, Recharts, Lucide React, jsPDF, Canvas Confetti
- **Integration**: REST API Client (`ApiService`), JWT Bearer Token Auth, CORS & Vite Reverse Proxy
