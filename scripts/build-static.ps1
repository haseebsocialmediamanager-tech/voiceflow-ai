# ─────────────────────────────────────────────────────────────────
# build-static.ps1
# Builds a static version of VoiceFlow for Hostinger shared hosting
# Run: powershell -ExecutionPolicy Bypass -File scripts/build-static.ps1
# ─────────────────────────────────────────────────────────────────

Write-Host "Building static export for Hostinger..." -ForegroundColor Cyan

# Backup current config
Copy-Item "next.config.mjs" "next.config.mjs.bak" -Force

# Use static config
Copy-Item "next.config.static.mjs" "next.config.mjs" -Force

# Build
npm run build

# Restore original config
Copy-Item "next.config.mjs.bak" "next.config.mjs" -Force
Remove-Item "next.config.mjs.bak"

# Zip the out folder
if (Test-Path "out") {
  Compress-Archive -Path "out\*" -DestinationPath "hostinger-upload.zip" -Force
  Write-Host ""
  Write-Host "Done! Upload hostinger-upload.zip contents to public_html" -ForegroundColor Green
  Write-Host "  1. Go to Hostinger → File Manager → public_html" -ForegroundColor Yellow
  Write-Host "  2. Delete existing files" -ForegroundColor Yellow
  Write-Host "  3. Upload and extract hostinger-upload.zip" -ForegroundColor Yellow
} else {
  Write-Host "Build failed — no /out folder found" -ForegroundColor Red
}
