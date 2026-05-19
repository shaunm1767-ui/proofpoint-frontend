# ===============================
# ProofPoint Clean Reset Script
# ===============================

Write-Host "🧹 ProofPoint project cleanup starting..." -ForegroundColor Cyan

# --- Safety check ---
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: package.json not found." -ForegroundColor Red
    Write-Host "Run this script from the project root (proofpoint-frontend)." -ForegroundColor Yellow
    exit 1
}

# --- Remove node_modules ---
if (Test-Path "node_modules") {
    Write-Host "🗑 Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
} else {
    Write-Host "✔ node_modules already removed." -ForegroundColor Green
}

# --- Remove .next build folder ---
if (Test-Path ".next") {
    Write-Host "🗑 Removing .next build cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
} else {
    Write-Host "✔ .next folder not present." -ForegroundColor Green
}

# --- Remove package-lock.json ---
if (Test-Path "package-lock.json") {
    Write-Host "🗑 Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force "package-lock.json"
} else {
    Write-Host "✔ package-lock.json not present." -ForegroundColor Green
}

# --- Reinstall dependencies ---
Write-Host "📦 Reinstalling dependencies (npm install)..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed. Fix errors above and re-run." -ForegroundColor Red
    exit 1
}

# --- Verify Next.js ---
Write-Host "🔍 Verifying Next.js installation..." -ForegroundColor Cyan
npm list next

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host "Next step:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
