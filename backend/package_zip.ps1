$src = 'c:\Users\sahan\OneDrive\Desktop\InfosysPro'
$dest = 'c:\Users\sahan\OneDrive\Desktop\InfosysPro\Digital-Subsidy-Grant-Administration-Platform-Group-1.zip'
$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

$excludeDirs = @('node_modules', 'target', '.git', 'dist', '.gemini')
$excludeFiles = @('*.zip', '*.log')

Get-ChildItem -Path $src -Recurse | ForEach-Object {
    $item = $_
    $relPath = $item.FullName.Substring($src.Length).TrimStart('\')
    
    $skip = $false
    foreach ($ex in $excludeDirs) {
        $parts = $relPath.Split([System.IO.Path]::DirectorySeparatorChar)
        if ($parts -contains $ex) {
            $skip = $true
            break
        }
    }
    
    if (-not $skip -and -not $item.PSIsContainer) {
        foreach ($exFile in $excludeFiles) {
            if ($item.Name -like $exFile) {
                $skip = $true
                break
            }
        }
    }
    
    if (-not $skip) {
        $targetPath = [System.IO.Path]::Combine($tempDir, $relPath)
        if ($item.PSIsContainer) {
            if (-not (Test-Path $targetPath)) {
                New-Item -ItemType Directory -Path $targetPath | Out-Null
            }
        } else {
            $parent = [System.IO.Path]::GetDirectoryName($targetPath)
            if (-not (Test-Path $parent)) {
                New-Item -ItemType Directory -Path $parent | Out-Null
            }
            Copy-Item -Path $item.FullName -Destination $targetPath -Force
        }
    }
}

if (Test-Path $dest) { Remove-Item $dest -Force }
Compress-Archive -Path "$tempDir\*" -DestinationPath $dest -CompressionLevel Optimal
Remove-Item -Recurse -Force $tempDir

$zipInfo = Get-Item $dest
$mb = [math]::Round($zipInfo.Length / 1MB, 2)
Write-Host "SUCCESS: Created $dest ($mb MB)"
