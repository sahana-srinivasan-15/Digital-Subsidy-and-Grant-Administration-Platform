$ErrorActionPreference = "Stop"

$workspace = "c:\Users\sahan\OneDrive\Desktop\InfosysPro"
$desktopZip = "c:\Users\sahan\OneDrive\Desktop\Digital-Subsidy-and-Grant-Administration-Platform-Group-1.zip"
$workspaceZip = "c:\Users\sahan\OneDrive\Desktop\InfosysPro\Digital-Subsidy-and-Grant-Administration-Platform-Group-1.zip"

$tempRoot = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.Guid]::NewGuid().ToString())
$projectDir = Join-Path $tempRoot "Digital-Subsidy-and-Grant-Administration-Platform-Group-1"
$backendDest = Join-Path $projectDir "backend"
$frontendDest = Join-Path $projectDir "frontend"

New-Item -ItemType Directory -Path $backendDest -Force | Out-Null
New-Item -ItemType Directory -Path $frontendDest -Force | Out-Null

Write-Host "Copying backend files..."
$backendSrc = Join-Path $workspace "backend"
$backendExclude = @("target", ".git", ".idea", "*.log")

Get-ChildItem -Path $backendSrc -Recurse | ForEach-Object {
    $item = $_
    $rel = $item.FullName.Substring($backendSrc.Length).TrimStart('\')
    
    $skip = $false
    foreach ($part in $rel.Split([System.IO.Path]::DirectorySeparatorChar)) {
        if ($part -eq "target" -or $part -eq ".git" -or $part -eq ".idea") {
            $skip = $true; break
        }
    }
    if ($item.Name -like "*.log" -or $item.Name -like "*.zip") { $skip = $true }
    
    if (-not $skip) {
        $target = Join-Path $backendDest $rel
        if ($item.PSIsContainer) {
            if (-not (Test-Path $target)) { New-Item -ItemType Directory -Path $target -Force | Out-Null }
        } else {
            $p = [System.IO.Path]::GetDirectoryName($target)
            if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
            try {
                Copy-Item -Path $item.FullName -Destination $target -Force -ErrorAction Stop
            } catch {
                try {
                    $inStream = [System.IO.File]::Open($item.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                    $outStream = [System.IO.File]::Create($target)
                    $inStream.CopyTo($outStream)
                    $inStream.Close()
                    $outStream.Close()
                } catch {
                    Write-Warning "Could not copy $($item.FullName): $_"
                }
            }
        }
    }
}

Write-Host "Copying frontend files..."
$frontendFiles = @("package.json", "package-lock.json", "vite.config.js", "tailwind.config.js", "postcss.config.js", ".oxlintrc.json", ".gitignore", "index.html", "design-system.html")
foreach ($f in $frontendFiles) {
    $srcFile = Join-Path $workspace $f
    if (Test-Path $srcFile) {
        Copy-Item -Path $srcFile -Destination (Join-Path $frontendDest $f) -Force
    }
}

$frontendDirs = @("src", "public")
foreach ($d in $frontendDirs) {
    $srcDir = Join-Path $workspace $d
    $dstDir = Join-Path $frontendDest $d
    if (Test-Path $srcDir) {
        Copy-Item -Path $srcDir -Destination $dstDir -Recurse -Force
    }
}

Write-Host "Creating root launch scripts and README..."
$rootRunBat = @"
@echo off
title Digital Subsidy & Grant Administration Platform (Group 1) - Launcher
echo ======================================================================
echo    Digital Subsidy & Grant Administration Platform (Group 1)
echo    Unified Citizen DBT & Grant Management Platform
echo ======================================================================
echo.
echo [1/2] Starting Spring Boot Backend on http://localhost:8080/ ...
start "DSGA Backend Server" cmd /k "cd backend && mvn spring-boot:run"

echo [2/2] Starting Frontend Web Portal on http://localhost:5173/ ...
cd frontend
if not exist node_modules (
    echo [INFO] Installing frontend node dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b %errorlevel%
    )
)
echo.
echo [SUCCESS] Backend starting on: http://localhost:8080/api (Swagger: http://localhost:8080/swagger-ui.html)
echo [SUCCESS] Frontend starting on: http://localhost:5173/
echo.
call npm run dev
pause
"@
Set-Content -Path (Join-Path $projectDir "run.bat") -Value $rootRunBat -Encoding Ascii

$rootRunBackendBat = @"
@echo off
title DSGA Spring Boot Backend
cd backend
mvn spring-boot:run
pause
"@
Set-Content -Path (Join-Path $projectDir "run-backend.bat") -Value $rootRunBackendBat -Encoding Ascii

$rootRunFrontendBat = @"
@echo off
title DSGA Frontend Portal
cd frontend
if not exist node_modules (
    call npm install
)
call npm run dev
pause
"@
Set-Content -Path (Join-Path $projectDir "run-frontend.bat") -Value $rootRunFrontendBat -Encoding Ascii

$rootReadme = @"
# Digital Subsidy & Grant Administration Platform (Group 1)

Unified full-stack government subsidy and grant administration platform connecting citizens, field verifiers, sanction authorities, and system administrators.

---

## 📁 Project Directory Structure

```
Digital-Subsidy-and-Grant-Administration-Platform-Group-1/
├── backend/                  <-- Spring Boot 3.2.5 REST API Backend
│   ├── pom.xml               <-- Maven project configuration
│   ├── schema.sql            <-- Database schema definitions
│   └── src/                  <-- Controllers, Services, Models, Repositories, DTOs
├── frontend/                 <-- React 19 + Vite Frontend Application
│   ├── package.json          <-- Frontend npm dependencies
│   ├── vite.config.js        <-- Vite configuration with /api backend proxy
│   ├── tailwind.config.js    <-- Tailwind CSS styling tokens
│   ├── index.html            <-- HTML entry point
│   └── src/                  <-- React components, pages, context, and ApiService
├── run.bat                   <-- Single-click runner (starts both backend & frontend)
├── run-backend.bat           <-- Starts backend only (port 8080)
├── run-frontend.bat          <-- Starts frontend only (port 5173)
└── README.md                 <-- Full documentation & execution instructions
```

---

## 🚀 How to Run the Platform

### Option 1: Single-Click Launch (Recommended)
Double-click **`run.bat`** in this folder:
- Starts Spring Boot on `http://localhost:8080` (with H2 in-memory DB and seeded demo data).
- Installs npm packages if needed and launches the web portal on `http://localhost:5173`.

### Option 2: Manual Launch

#### 1. Backend (Spring Boot 3.2.5)
```bash
cd backend
mvn spring-boot:run
```
- API Base: `http://localhost:8080/api`
- Swagger UI docs: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:subsidydb`, Username: `sa`, Password: *blank*)

#### 2. Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173/`

---

## 👥 Demo Personas & Credentials
| Role | Email | Password | Scope / Permissions |
|---|---|---|---|
| **Citizen / Applicant** | `applicant@gov.in` | `password123` | Browse 6 schemes, submit applications, live tracking |
| **Field Verifier** | `verifier@gov.in` | `password123` | Inspect submitted applications, verify documents & score |
| **Sanction Authority** | `authority@gov.in` | `password123` | Review verified applications, approve/sanction DBT grants |
| **Administrator** | `admin@gov.in` | `password123` | Analytics, audit logs, scheme management |

---

## 🛠️ Technology Stack
- **Backend**: Java 17, Spring Boot 3.2.5, Spring Data JPA, Spring Security (JWT HS512), H2 Database, Maven
- **Frontend**: React 19, Vite 8, Tailwind CSS, Recharts, Lucide React, Canvas Confetti
- **Integration**: REST API Client (`ApiService`), JWT Bearer Token Auth, CORS & Vite Reverse Proxy
"@
Set-Content -Path (Join-Path $projectDir "README.md") -Value $rootReadme -Encoding UTF8

Write-Host "Creating zip files..."
if (Test-Path $desktopZip) { Remove-Item $desktopZip -Force }
if (Test-Path $workspaceZip) { Remove-Item $workspaceZip -Force }

Compress-Archive -Path "$projectDir\*" -DestinationPath $desktopZip -CompressionLevel Optimal
Copy-Item -Path $desktopZip -Destination $workspaceZip -Force
Copy-Item -Path $desktopZip -Destination "c:\Users\sahan\OneDrive\Desktop\Digital-Subsidy-Grant-Administration-Platform-Group-1.zip" -Force
Copy-Item -Path $desktopZip -Destination "c:\Users\sahan\OneDrive\Desktop\InfosysPro\Digital-Subsidy-Grant-Administration-Platform-Group-1.zip" -Force

Remove-Item -Recurse -Force $tempRoot

$dInfo = Get-Item $desktopZip
$wInfo = Get-Item $workspaceZip
$dMb = [math]::Round($dInfo.Length / 1MB, 2)
Write-Host "SUCCESS: Generated Desktop ZIP -> $desktopZip ($dMb MB)"
Write-Host "SUCCESS: Generated Workspace ZIP -> $workspaceZip ($dMb MB)"
