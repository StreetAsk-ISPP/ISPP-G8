# Script para limpiar caché de Java en VS Code (Windows)
# Ejecutar si aparecen errores falsos de dependencias en VS Code

Write-Host "Limpiando cache de Java Language Server..." -ForegroundColor Yellow

# Cerrar VS Code primero
$vscodeRunning = Get-Process -Name "Code" -ErrorAction SilentlyContinue
if ($vscodeRunning) {
    Write-Host "Por favor, cierra VS Code antes de ejecutar este script." -ForegroundColor Red
    exit 1
}

# Limpiar cache del Java Language Server
$workspaceStorage = "$env:APPDATA\Code\User\workspaceStorage"
if (Test-Path $workspaceStorage) {
    Get-ChildItem -Path $workspaceStorage -Directory | ForEach-Object {
        $javaFolder = Join-Path $_.FullName "redhat.java"
        if (Test-Path $javaFolder) {
            Remove-Item -Recurse -Force $javaFolder
            Write-Host "Eliminado: $javaFolder" -ForegroundColor Green
        }
    }
}

# Limpiar target de Maven
if (Test-Path "target") {
    Remove-Item -Recurse -Force "target"
    Write-Host "Eliminado: target/" -ForegroundColor Green
}

Write-Host ""
Write-Host "Cache limpiado. Ahora:" -ForegroundColor Cyan
Write-Host "1. Abre VS Code"
Write-Host "2. Espera a que Java Language Server se reinicie (~30 segundos)"
Write-Host "3. Si aun hay errores, presiona Ctrl+Shift+P y ejecuta 'Java: Clean Java Language Server Workspace'"
