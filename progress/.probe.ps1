$paths = @(
  '/',
  '/industry',
  '/academic',
  '/contact',
  '/cv',
  '/cv/base',
  '/cv/academic',
  '/cv/professional',
  '/robots.txt',
  '/sitemap.xml',
  '/feed.xml',
  '/og/home.png'
)
foreach ($p in $paths) {
  try {
    $r = Invoke-WebRequest ('http://localhost:3000' + $p) -UseBasicParsing -TimeoutSec 15
    Write-Host ($p + ' -> ' + $r.StatusCode)
  } catch {
    $msg = $_.Exception.Message -replace "`r`n", ' ' -replace "`n", ' '
    if ($msg.Length -gt 120) { $msg = $msg.Substring(0, 120) + '...' }
    Write-Host ($p + ' -> ERR: ' + $msg)
  }
}
