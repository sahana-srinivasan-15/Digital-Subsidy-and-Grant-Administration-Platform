$parent = "C:\Users\sahan\OneDrive\Desktop\Digital-Subsidy-and-Grant-Administration-Platform-Group-1"
$inner = Join-Path $parent "Digital-Subsidy-and-Grant-Administration-Platform-Group-1"
if (Test-Path $inner) {
    Get-ChildItem -Path $inner | ForEach-Object {
        Move-Item -Path $_.FullName -Destination $parent -Force
    }
    Remove-Item -Path $inner -Force -Recurse
    Write-Host "SUCCESS: Un-nested the folder structure!"
} else {
    Write-Host "Already un-nested or inner folder not found."
}

# Also recreate the zip flat so that extracting it produces a clean single folder
$desktopZip = "c:\Users\sahan\OneDrive\Desktop\Digital-Subsidy-and-Grant-Administration-Platform-Group-1.zip"
$workspaceZip = "c:\Users\sahan\OneDrive\Desktop\InfosysPro\Digital-Subsidy-and-Grant-Administration-Platform-Group-1.zip"
if (Test-Path $desktopZip) { Remove-Item $desktopZip -Force }
if (Test-Path $workspaceZip) { Remove-Item $workspaceZip -Force }

Compress-Archive -Path "$parent\*" -DestinationPath $desktopZip -CompressionLevel Optimal
Copy-Item -Path $desktopZip -Destination $workspaceZip -Force
Write-Host "SUCCESS: Updated zip files without duplicate nesting!"
