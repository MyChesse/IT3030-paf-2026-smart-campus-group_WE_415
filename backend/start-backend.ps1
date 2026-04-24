param(
    [int]$Port = 8081,
    [switch]$AllowNonJavaKill,
    [switch]$NoRun,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

Write-Host "Checking listeners on port $Port..."
$listeners = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue

if ($null -ne $listeners) {
    $ownerIds = $listeners | Select-Object -ExpandProperty OwningProcess -Unique | Where-Object { $_ -gt 0 }

    foreach ($processId in $ownerIds) {
        $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
        $procName = if ($null -ne $proc) { $proc.ProcessName } else { 'UNKNOWN' }

        if ($procName -ieq 'java' -or $AllowNonJavaKill) {
            if ($DryRun) {
                Write-Host "[DryRun] Would stop PID=$processId NAME=$procName (port $Port listener)."
            } else {
                Write-Host "Stopping PID=$processId NAME=$procName (port $Port listener)..."
                Stop-Process -Id $processId -Force -ErrorAction Stop
            }
        } else {
            throw "Port $Port is used by PID=$processId NAME=$procName. Re-run with -AllowNonJavaKill if you want to stop it."
        }
    }
}

if (-not $DryRun) {
    $remaining = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
    if ($null -ne $remaining) {
        $stillInUse = $remaining | Select-Object -ExpandProperty OwningProcess -Unique
        throw "Port $Port is still in use by PID(s): $($stillInUse -join ', ')."
    }
}

if ($DryRun) {
    Write-Host "[DryRun] Port cleanup check complete."
    if ($NoRun) {
        Write-Host "[DryRun] -NoRun set. Startup skipped."
    } else {
        Write-Host "[DryRun] Would run: mvn spring-boot:run"
    }
    exit 0
}

if ($NoRun) {
    Write-Host "Port cleanup complete. Startup skipped because -NoRun was provided."
    exit 0
}

Write-Host "Port $Port is free. Starting Spring Boot..."
Push-Location $PSScriptRoot
try {
    mvn spring-boot:run
}
finally {
    Pop-Location
}
