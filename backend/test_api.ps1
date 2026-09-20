$loginBody = '{"email":"applicant@gov.in","password":"password123"}'
Write-Host "Logging in applicant..."
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "Login response:"
$loginRes | ConvertTo-Json

$token = if ($loginRes.accessToken) { $loginRes.accessToken } else { $loginRes.token }
$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host "`nCalling GET /api/auth/me..."
$me = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Method Get -Headers $headers
$me | ConvertTo-Json

Write-Host "`nCalling GET /api/applications..."
$apps = Invoke-RestMethod -Uri "http://localhost:8080/api/applications" -Method Get -Headers $headers
$apps | ConvertTo-Json -Depth 3

Write-Host "`nLogging in verifier..."
$verifierBody = '{"email":"verifier@gov.in","password":"password123"}'
$vLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $verifierBody -ContentType "application/json"
$vToken = if ($vLogin.accessToken) { $vLogin.accessToken } else { $vLogin.token }
$vHeaders = @{
    "Authorization" = "Bearer $vToken"
}
Write-Host "Verifier logged in: $($vLogin.name), role: $($vLogin.role)"
Write-Host "`nTesting Application Creation by Applicant (Rahul Kumar) for Scheme 3 (PM-JAY)..."
$appBody = '{"applicantId":1,"schemeId":3,"requestedAmount":50000.00}'
$newApp = Invoke-RestMethod -Uri "http://localhost:8080/api/applications" -Method Post -Body $appBody -Headers $headers -ContentType "application/json"
Write-Host "Created Application ID: $($newApp.applicationId), Number: $($newApp.applicationNumber), Status: $($newApp.applicationStatus)"

Write-Host "`nTesting Verification by Verifier (Anil Sharma)..."
$verifyBody = "{`"applicationId`":$($newApp.applicationId),`"verifierId`":2,`"verificationScore`":98.5,`"verifierComments`":`"Field documentation verified successfully`",`"verificationStatus`":`"VERIFIED`"}"
$verifyRes = Invoke-RestMethod -Uri "http://localhost:8080/api/verifications" -Method Post -Body $verifyBody -Headers $vHeaders -ContentType "application/json"
Write-Host "Verification result ID: $($verifyRes.verificationId), Status: $($verifyRes.status)"

Write-Host "`nLogging in Authority..."
$authBody = '{"email":"authority@gov.in","password":"password123"}'
$aLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $authBody -ContentType "application/json"
$aToken = if ($aLogin.accessToken) { $aLogin.accessToken } else { $aLogin.token }
$aHeaders = @{ "Authorization" = "Bearer $aToken" }
Write-Host "Authority logged in: $($aLogin.name), role: $($aLogin.role)"

Write-Host "`nTesting Sanction Approval by Authority (Dr. Priya Varma)..."
$approveBody = "{`"applicationId`":$($newApp.applicationId),`"authorityId`":3,`"approvedAmount`":50000.00,`"authorityComments`":`"Approved under Ayushman Bharat scheme quota`",`"decision`":`"APPROVED`"}"
$apprRes = Invoke-RestMethod -Uri "http://localhost:8080/api/approvals/approve" -Method Post -Body $approveBody -Headers $aHeaders -ContentType "application/json"
Write-Host "Approval result ID: $($apprRes.approvalId), Decision: $($apprRes.status), Amount: $($apprRes.approvedAmount)"

Write-Host "`nLogging in Administrator..."
$adminBody = '{"email":"admin@gov.in","password":"password123"}'
$admLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
$admToken = if ($admLogin.accessToken) { $admLogin.accessToken } else { $admLogin.token }
$admHeaders = @{ "Authorization" = "Bearer $admToken" }
Write-Host "Admin logged in: $($admLogin.name), role: $($admLogin.role)"

Write-Host "`nTesting Audit Logs endpoint by Administrator..."
$auditLogs = Invoke-RestMethod -Uri "http://localhost:8080/api/audit-logs" -Method Get -Headers $admHeaders
Write-Host "Audit logs count: $($auditLogs.totalElements)"

