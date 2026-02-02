# Push Changan SAV to GitHub
# This script initializes a clean git repo and pushes to GitHub

Write-Host "🚀 Push Changan SAV to GitHub" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (Test-Path .git) {
    Write-Host "⚠️  Git repository already exists." -ForegroundColor Yellow
    $reinit = Read-Host "Remove existing git history and start fresh? (Y/N)"
    
    if ($reinit -eq "Y" -or $reinit -eq "y") {
        Write-Host "Removing old git repository..." -ForegroundColor Gray
        Remove-Item -Recurse -Force .git
        Write-Host "✅ Old git history removed" -ForegroundColor Green
    } else {
        Write-Host "Keeping existing git repository..." -ForegroundColor Gray
    }
}

# Initialize new git repo if needed
if (-not (Test-Path .git)) {
    Write-Host ""
    Write-Host "Initializing new Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Setting up repository..." -ForegroundColor Cyan

# Set main branch
git branch -M main

# Add all files
Write-Host "Adding files..." -ForegroundColor Gray
git add .

# Check status
Write-Host ""
Write-Host "Files to commit:" -ForegroundColor Yellow
git status --short

Write-Host ""
$confirm = Read-Host "Commit these files? (Y/N)"

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit
}

# Commit
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "feat: Initial commit - Changan SAV WhatsApp Flow System

- WhatsApp Flow with 8-screen satisfaction survey
- Neon PostgreSQL database with auto-analytics
- End-to-end RSA + AES-GCM encryption
- Real-time dashboard with NPS, satisfaction metrics
- Excel export with 22 formatted columns
- Serverless deployment on Vercel
- Auto-table creation and data validation
- Complete documentation and setup guides"

Write-Host "✅ Commit created" -ForegroundColor Green

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Repository settings:" -ForegroundColor White
Write-Host "   Name: changan-sav" -ForegroundColor Gray
Write-Host "   Description: WhatsApp Flow satisfaction survey system" -ForegroundColor Gray
Write-Host "   Private: ✅ (recommended)" -ForegroundColor Gray
Write-Host "   Initialize: ❌ (do NOT add README, .gitignore, or license)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. After creating, copy the repository URL" -ForegroundColor White
Write-Host "   Example: https://github.com/YOUR_USERNAME/changan-sav.git" -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

$repoUrl = Read-Host "Paste your GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host ""
    Write-Host "No URL provided. You can add it later with:" -ForegroundColor Yellow
    Write-Host "git remote add origin YOUR_REPO_URL" -ForegroundColor Gray
    Write-Host "git push -u origin main" -ForegroundColor Gray
    exit
}

# Add remote
Write-Host ""
Write-Host "Adding remote repository..." -ForegroundColor Cyan
git remote add origin $repoUrl
Write-Host "✅ Remote added" -ForegroundColor Green

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository: $repoUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "✅ Rename README-GITHUB.md to README.md on GitHub" -ForegroundColor White
Write-Host "✅ Add repository description and topics" -ForegroundColor White
Write-Host "✅ Consider adding a LICENSE file" -ForegroundColor White
Write-Host ""
