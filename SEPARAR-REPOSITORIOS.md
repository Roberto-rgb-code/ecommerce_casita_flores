# 📦 Guía: Separar E-commerce y Admin en Repositorios Diferentes

## 🎯 **Objetivo**
Separar el proyecto en dos repositorios independientes:
- **E-commerce** (público) → `flores-ecommerce`
- **Admin** (privado) → `flores-admin`

---

## 📋 **PASO 1: Preparar Carpetas Locales**

### **1.1 Estructura Actual**
```
flores_ecomerce/
├── app/
├── components/
├── admin/          ← Todo esto se va a mover
└── ...
```

### **1.2 Crear Carpeta para Admin**
```bash
# Desde la raíz de tu proyecto
cd ..

# Crear nueva carpeta para admin
mkdir flores-admin

# Copiar todo el contenido de admin/
cp -r flores_ecomerce/admin/* flores-admin/

# Verificar que se copió todo
ls flores-admin/
```

### **1.3 Limpiar E-commerce**
```bash
cd flores_ecomerce

# Eliminar carpeta admin (ya está copiada)
rm -rf admin/

# Verificar que ya no existe
ls
```

---

## 🔧 **PASO 2: Configurar E-commerce**

### **2.1 Crear .env.local**
```bash
# En flores_ecomerce/
# Copia el archivo de ejemplo
cp env.example .env.local
```

**Contenido de `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-stripe-publishable-key
STRIPE_SECRET_KEY=tu-stripe-secret-key
```

### **2.2 Instalar dependencias actualizadas**
```bash
npm install
```

### **2.3 Probar E-commerce**
```bash
npm run dev
# Debería funcionar en http://localhost:3000
```

---

## 🔐 **PASO 3: Configurar Admin**

### **3.1 Ir a carpeta Admin**
```bash
cd ../flores-admin
```

### **3.2 Crear .env.local**
```bash
cp env.example .env.local
```

**Contenido de `.env.local`:**
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=genera-con-openssl-rand-base64-32

NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=buscar-en-supabase-settings

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-stripe-publishable-key
STRIPE_SECRET_KEY=tu-stripe-secret-key

AWS_ACCESS_KEY_ID=pendiente
AWS_SECRET_ACCESS_KEY=pendiente
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=pendiente
```

### **3.3 Instalar dependencias**
```bash
npm install
```

### **3.4 Probar Admin**
```bash
npm run dev
# Debería funcionar en http://localhost:3001
```

---

## 🌐 **PASO 4: Crear Repositorios en GitHub**

### **4.1 Crear Repo para E-commerce**
1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `flores-ecommerce`
3. Visibilidad: **Público** (o privado si prefieres)
4. **NO** inicialices con README
5. Crear repositorio

### **4.2 Crear Repo para Admin**
1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `flores-admin`
3. Visibilidad: **Privado** ✅ (importante por seguridad)
4. **NO** inicialices con README
5. Crear repositorio

---

## 🚀 **PASO 5: Subir E-commerce a GitHub**

```bash
# En flores_ecomerce/
cd flores_ecomerce

# Inicializar git (si no está ya)
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit - E-commerce"

# Conectar con GitHub
git remote add origin https://github.com/TU-USUARIO/flores-ecommerce.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 **PASO 6: Subir Admin a GitHub**

```bash
# En flores-admin/
cd ../flores-admin

# Inicializar git
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit - Admin Panel"

# Conectar con GitHub
git remote add origin https://github.com/TU-USUARIO/flores-admin.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

---

## ☁️ **PASO 7: Deploy en Vercel**

### **7.1 Deploy E-commerce**
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa `flores-ecommerce`
3. Configuración:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/`
   - **Build Command**: `npm run build`
4. Variables de entorno:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-stripe-publishable-key
   STRIPE_SECRET_KEY=tu-stripe-secret-key
   ```
5. Deploy!

### **7.2 Deploy Admin**
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa `flores-admin`
3. Configuración:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/`
   - **Build Command**: `npm run build`
4. Variables de entorno (TODAS las del .env.local):
   ```
   NEXTAUTH_URL=https://tu-admin.vercel.app
   NEXTAUTH_SECRET=tu-secret
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   STRIPE_SECRET_KEY=...
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=...
   ```
5. Deploy!

---

## ✅ **PASO 8: Verificar Todo Funciona**

### **E-commerce**
- [ ] Se ve en: `https://flores-ecommerce.vercel.app`
- [ ] Los productos se cargan desde Supabase
- [ ] El carrito funciona
- [ ] El checkout funciona

### **Admin**
- [ ] Se ve en: `https://flores-admin.vercel.app`
- [ ] Puedes iniciar sesión
- [ ] Puedes crear productos
- [ ] Los productos aparecen en el e-commerce

---

## 🔗 **RESULTADO FINAL**

```
📦 REPOSITORIOS:
├── github.com/TU-USUARIO/flores-ecommerce (público)
└── github.com/TU-USUARIO/flores-admin (privado)

🌐 DEPLOYS:
├── https://flores-ecommerce.vercel.app (público)
└── https://flores-admin.vercel.app (privado)

🗄️ BASE DE DATOS:
└── Supabase (compartida entre ambos)
```

---

## 🆘 **Troubleshooting**

### **Error: "Missing env.NEXT_PUBLIC_SUPABASE_URL"**
- Crea el archivo `.env.local` en cada proyecto
- Verifica que tenga las variables correctas

### **E-commerce no muestra productos**
- Verifica que la base de datos tenga productos
- Verifica que los productos tengan `is_active = true`
- Revisa los logs en Vercel

### **Admin no puede crear productos**
- Verifica `SUPABASE_SERVICE_ROLE_KEY`
- Verifica que las tablas existan en Supabase

---

## ✨ **¡Listo!**

Ahora tienes dos proyectos completamente separados que comparten la misma base de datos. 🎉

**E-commerce**: Los clientes compran flores  
**Admin**: Tú gestionas los productos

Ambos usan Supabase para comunicarse. 🚀
