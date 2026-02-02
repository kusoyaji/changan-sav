# Quick setup script for Vercel environment variables

Write-Host "🔧 Changan SAV - Setup Vercel KV Storage" -ForegroundColor Cyan
Write-Host ""

Write-Host "First, create your Upstash Redis database:" -ForegroundColor Yellow
Write-Host "1. Go to https://upstash.com/" -ForegroundColor White
Write-Host "2. Create a new database (Regional, Europe)" -ForegroundColor White
Write-Host "3. Copy the REST URL and REST TOKEN" -ForegroundColor White
Write-Host ""

$url = Read-Host "Enter your UPSTASH_REDIS_REST_URL (https://xxx.upstash.io)"
$token = Read-Host "Enter your UPSTASH_REDIS_REST_TOKEN"

Write-Host ""
Write-Host "Adding environment variables to Vercel..." -ForegroundColor Cyan

# Add URL
Write-Host "Adding KV_REST_API_URL..." -ForegroundColor Gray
$url | vercel env add KV_REST_API_URL production preview development

# Add TOKEN
Write-Host "Adding KV_REST_API_TOKEN..." -ForegroundColor Gray
$token | vercel env add KV_REST_API_TOKEN production preview development

Write-Host ""
Write-Host "✅ Environment variables added!" -ForegroundColor Green
Write-Host ""
Write-Host "Now deploying to production..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Test your setup:" -ForegroundColor Yellow
Write-Host "1. Send a test survey via WhatsApp" -ForegroundColor White
Write-Host "2. Check https://y-gamma-six-62.vercel.app/" -ForegroundColor White
Write-Host "3. Click 'Exporter Excel' to download data" -ForegroundColor White
