# 🌸 La Casita de las Flores - Sistema Completo

Sistema completo de e-commerce con panel de administración para venta de flores.

---

## 📦 **ESTRUCTURA DEL PROYECTO**

### **Dos Proyectos Independientes:**

```
┌─────────────────────────────────────────┐
│  E-COMMERCE (Público)                   │
│  ├── Catálogo de productos              │
│  ├── Carrito de compras                 │
│  ├── Checkout con Stripe                │
│  └── Lee datos de Supabase              │
│                                          │
│  📍 https://flores-ecommerce.vercel.app │
│  📁 Repo: flores-ecommerce              │
└─────────────────────────────────────────┘
                    ↕
        ┌───────────────────────┐
        │   SUPABASE            │
        │   Base de Datos       │
        │   ├── products        │
        │   ├── orders          │
        │   └── order_items     │
        └───────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│  ADMIN PANEL (Privado)                  │
│  ├── Gestión de productos              │
│  ├── Subida de imágenes (AWS S3)       │
│  ├── Gestión de órdenes                │
│  └── Escribe en Supabase               │
│                                          │
│  📍 https://flores-admin.vercel.app     │
│  📁 Repo: flores-admin                  │
└─────────────────────────────────────────┘
```

---

## 🚀 **INICIO RÁPIDO**

### **1. E-commerce**
```bash
# Instalar dependencias
npm install

# Configurar .env.local
cp env.example .env.local
# Editar con tus credenciales

# Ejecutar
npm run dev
# http://localhost:3000
```

### **2. Admin Panel**
```bash
cd admin  # Si aún no lo has movido

# Instalar dependencias
npm install

# Configurar .env.local
cp env.example .env.local
# Editar con tus credenciales

# Ejecutar
npm run dev
# http://localhost:3001
```

---

## 📋 **CONFIGURACIÓN**

### **Variables de Entorno Necesarias:**

#### **E-commerce (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=tu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-key
STRIPE_SECRET_KEY=tu-key
```

#### **Admin (.env.local)**
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=genera-con-openssl
NEXT_PUBLIC_SUPABASE_URL=tu-url (MISMA)
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key (MISMA)
SUPABASE_SERVICE_ROLE_KEY=tu-key-de-servicio
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-key (MISMA)
STRIPE_SECRET_KEY=tu-key (MISMA)
AWS_ACCESS_KEY_ID=tu-key
AWS_SECRET_ACCESS_KEY=tu-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=tu-bucket
```

---

## 🗄️ **BASE DE DATOS (Supabase)**

### **Setup Inicial:**
1. Ve a Supabase Dashboard
2. Abre SQL Editor
3. Ejecuta el script: `admin/supabase-setup.sql`
4. Verifica que se crearon las tablas

### **Tablas:**
- `products` - Catálogo de productos
- `orders` - Órdenes de compra
- `order_items` - Items de cada orden

---

## 🔄 **FLUJO DE TRABAJO**

### **1. Admin crea productos**
```
Admin Panel → Crear Producto → Guardar en Supabase → Subir imagen a S3
```

### **2. Cliente compra**
```
E-commerce → Ver productos de Supabase → Agregar al carrito → Checkout con Stripe
```

### **3. Admin gestiona órdenes**
```
Admin Panel → Ver órdenes → Actualizar estado → Cliente recibe notificación
```

---

## 📚 **DOCUMENTACIÓN**

- 📘 **SEPARAR-REPOSITORIOS.md** - Cómo separar en dos repos
- 📗 **admin/SETUP-INSTRUCTIONS.md** - Setup del admin
- 📕 **admin/RESUMEN-COMPLETO.md** - Todo lo implementado

---

## 🌐 **DEPLOY**

### **Vercel (Recomendado)**
- **E-commerce**: Deploy desde repo `flores-ecommerce`
- **Admin**: Deploy desde repo `flores-admin`

### **Otras opciones:**
- Railway
- DigitalOcean App Platform
- AWS Amplify

---

## 🛠️ **TECNOLOGÍAS**

### **Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

### **Backend:**
- Supabase (PostgreSQL)
- NextAuth.js
- Stripe
- AWS S3

### **Deploy:**
- Vercel

---

## ✨ **CARACTERÍSTICAS**

### **E-commerce:**
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Búsqueda y filtros
- ✅ Categorías
- ✅ Checkout con Stripe
- ✅ Responsive design

### **Admin:**
- ✅ Autenticación segura
- ✅ CRUD de productos
- ✅ Subida de imágenes
- ✅ Dashboard con métricas
- ✅ Gestión de órdenes
- ✅ Responsive design

---

## 🔒 **SEGURIDAD**

- ✅ Autenticación con NextAuth
- ✅ Row Level Security en Supabase
- ✅ Variables de entorno seguras
- ✅ Admin panel privado
- ✅ Validación de formularios

---

## 📞 **SOPORTE**

Para dudas o problemas:
1. Revisa la documentación en `/admin/`
2. Verifica logs en Vercel Dashboard
3. Revisa logs en Supabase Dashboard

---

## 📝 **NOTAS IMPORTANTES**

1. **Supabase**: Ambos proyectos usan la misma base de datos
2. **Stripe**: Ambos proyectos usan las mismas claves
3. **AWS S3**: Solo el admin lo necesita
4. **Deploy**: Pueden estar en diferentes plataformas

---

## 🎉 **¡Proyecto Completo!**

Un sistema profesional de e-commerce con:
- ✅ Panel de administración
- ✅ Tienda online
- ✅ Pagos con Stripe
- ✅ Base de datos en la nube
- ✅ Almacenamiento de imágenes
- ✅ Deploy-ready

**¡Todo listo para producción!** 🚀
