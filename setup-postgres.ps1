# Quick Neon PostgreSQL Database Setup
# Run this script to add your database connection string

Write-Host "🗄️  Changan SAV - Neon PostgreSQL Database Setup" -ForegroundColor Cyan
Write-Host ""

Write-Host "First, create your Neon database:" -ForegroundColor Yellow
Write-Host "1. Go to https://neon.tech/" -ForegroundColor White
Write-Host "2. Sign up (free, use GitHub)" -ForegroundColor White
Write-Host "3. Create project: 'changan-sav', Region: Europe (Frankfurt)" -ForegroundColor White
Write-Host "4. Copy the connection string" -ForegroundColor White
Write-Host ""

$dbUrl = Read-Host "Paste your DATABASE_URL (postgresql://user:password@...)"

Write-Host ""
Write-Host "Adding DATABASE_URL to Vercel..." -ForegroundColor Cyan

# Add DATABASE_URL
Write-Host "Setting environment variable..." -ForegroundColor Gray
$dbUrl | vercel env add DATABASE_URL production preview development

Write-Host ""
Write-Host "✅ Environment variable added!" -ForegroundColor Green
Write-Host ""
Write-Host "Deploying to production..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Test your setup:" -ForegroundColor Yellow
Write-Host "1. Send a test survey via WhatsApp" -ForegroundColor White
Write-Host "2. Check https://y-gamma-six-62.vercel.app/" -ForegroundColor White
Write-Host "3. Click 'Exporter Excel' to download data" -ForegroundColor White
Write-Host ""
Write-Host "The table will auto-create on first survey!" -ForegroundColor Cyan
