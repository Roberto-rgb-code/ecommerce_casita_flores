# Script para crear .env.local con credenciales
# IMPORTANTE: Este script copia env.example a .env.local
# Debes editar manualmente .env.local con tus credenciales reales

Write-Host "Creando archivo .env.local..." -ForegroundColor Green

# Verificar que existe env.example
if (!(Test-Path "env.example")) {
    Write-Host "Error: No se encontró el archivo env.example" -ForegroundColor Red
    exit 1
}

# Copiar env.example a .env.local
Copy-Item "env.example" ".env.local"

Write-Host "✅ Archivo .env.local creado desde env.example" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Ahora debes editar .env.local con tus credenciales reales" -ForegroundColor Yellow
Write-Host "Este archivo NO se subirá a GitHub (está en .gitignore)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Después de editar .env.local, ejecuta: npm run dev" -ForegroundColor Cyan

