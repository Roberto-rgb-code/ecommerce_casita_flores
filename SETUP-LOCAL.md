# 🚀 Setup Local - La Casita de las Flores

## 📋 Pasos para configurar el proyecto localmente:

### 1️⃣ **Crear archivo de credenciales**

Ejecuta este comando en PowerShell desde la carpeta `flores_ecomerce`:

```powershell
.\crear-env-local.ps1
```

Este comando copiará `env.example` a `.env.local`.

### 2️⃣ **Agregar credenciales reales**

Abre el archivo `.env.local` y reemplaza los placeholders con las credenciales reales.

📋 Las credenciales reales están en el archivo `CREDENCIALES-LOCALES.txt` (que NO se sube a GitHub).

### 3️⃣ **Instalar dependencias**

```bash
npm install
```

### 4️⃣ **Ejecutar el proyecto**

```bash
npm run dev
```

El sitio estará disponible en: http://localhost:3000

---

## 📝 Notas importantes:

- ✅ El archivo `.env.local` contiene las credenciales REALES (crear manualmente)
- ✅ El archivo `CREDENCIALES-LOCALES.txt` contiene las credenciales para copiar
- ✅ Ambos archivos **NO se suben a GitHub** (están en .gitignore)
- ✅ El archivo `env.example` es una plantilla segura (se sube a GitHub)
- ✅ El script `crear-env-local.ps1` solo copia el template

---

## 🔄 Si necesitas recrear el .env.local:

1. Ejecuta de nuevo:
```powershell
.\crear-env-local.ps1
```

2. Copia las credenciales de `CREDENCIALES-LOCALES.txt` a `.env.local`

---

¡Listo para desarrollar! 🌸

