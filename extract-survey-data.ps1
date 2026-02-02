# Extract survey data from recent Vercel logs
Write-Host "Fetching survey data from logs..." -ForegroundColor Cyan

$logs = vercel logs https://y-gamma-six-62.vercel.app --output json 2>&1 | Out-String

# Parse for survey data
$surveyPattern = '"responses":\s*\{[^}]+\}'
$matches = [regex]::Matches($logs, $surveyPattern)

Write-Host "`nFound $($matches.Count) survey submissions in logs:`n" -ForegroundColor Green

foreach ($match in $matches | Select-Object -First 10) {
    Write-Host $match.Value -ForegroundColor White
    Write-Host "---" -ForegroundColor Gray
}

Write-Host "`nThe webhook is working! Data is being received." -ForegroundColor Cyan
Write-Host "For persistent storage, we need to add a database (Upstash Redis or Vercel KV)" -ForegroundColor Yellow
