$packageJsonPath = "C:\Users\Shaun\Desktop\TRANSFER_READY\Projects\GitHub - Copy\proofpoint\frontend\package.json"

# Read the raw file
$rawJson = Get-Content $packageJsonPath -Raw

try {
    # Try parsing JSON
    $packageObj = $rawJson | ConvertFrom-Json
} catch {
    Write-Host "Error: package.json is invalid. Attempting to auto-fix common issues..."
    
    # Remove trailing commas after last property in objects or arrays
    $fixedJson = $rawJson -replace ',\s*(\}|])', '$1'
    
    try {
        $packageObj = $fixedJson | ConvertFrom-Json
        Write-Host "JSON auto-fixed successfully."
    } catch {
        Write-Host "Failed to fix JSON automatically. Manual edit required."
        exit
    }
}

# Add "type": "module" if not present
if (-not $packageObj.PSObject.Properties.Name -contains "type") {
    $packageObj | Add-Member -NotePropertyName "type" -NotePropertyValue "module"
    Write-Host '"type": "module" added to package.json'
} else {
    Write-Host '"type" already exists in package.json'
}

# Save back to package.json with proper formatting
$packageObj | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 $packageJsonPath

Write-Host "package.json updated successfully!"
