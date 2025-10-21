# =================================================================
# SCRIPT PARA LIMPIAR CACHÉ DE NEXT.JS
# Ejecuta este script cuando borres productos del admin
# =================================================================

Write-Host "🧹 Limpiando caché de Next.js..." -ForegroundColor Yellow

# Detener el servidor si está corriendo
Write-Host "⏹️  Deteniendo servidor..." -ForegroundColor Blue
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Limpiar caché de Next.js
Write-Host "🗑️  Eliminando carpeta .next..." -ForegroundColor Blue
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Limpiar node_modules (opcional, solo si hay problemas)
# Write-Host "🗑️  Eliminando node_modules..." -ForegroundColor Blue
# Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Limpiar caché de npm
Write-Host "🧹 Limpiando caché de npm..." -ForegroundColor Blue
npm cache clean --force

Write-Host "✅ Caché limpiado correctamente!" -ForegroundColor Green
Write-Host "🚀 Ahora ejecuta: npm run dev" -ForegroundColor Cyan

# Esperar un momento
Start-Sleep -Seconds 2

# Preguntar si quiere iniciar el servidor
$response = Read-Host "¿Quieres iniciar el servidor ahora? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
    npm run dev
}
