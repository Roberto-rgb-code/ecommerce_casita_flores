# 📍 Configurar Google Address Validation API

## ✅ ¿Qué es Address Validation API?

Es la API recomendada por Google para validar direcciones completas. Proporciona:
- ✅ Validación precisa de direcciones
- ✅ Corrección automática de errores
- ✅ Estandarización de formatos
- ✅ Niveles de confianza (confirmada, plausible, sospechosa)

---

## 🚀 PASO 1: Habilitar la API en Google Cloud

### 1.1 Ir a Google Cloud Console
1. Ve a: **https://console.cloud.google.com/**
2. Selecciona tu proyecto (o crea uno nuevo)

### 1.2 Habilitar Address Validation API
1. Ve a: **APIs & Services** → **Library**
2. Busca: **"Address Validation API"**
3. Haz clic en el resultado
4. Haz clic en **"ENABLE"** (Habilitar)

### 1.3 Verificar APIs Habilitadas
Deberías tener habilitadas:
- ✅ **Address Validation API**
- ✅ **Maps JavaScript API** (para autocompletado)
- ✅ **Distance Matrix API** (para calcular distancias)
- ✅ **Places API** (para autocompletado)

---

## 🔑 PASO 2: Verificar API Key

### 2.1 Ir a Credenciales
1. Ve a: **APIs & Services** → **Credentials**
2. Busca tu **API Key** (la misma que usas para Maps)

### 2.2 Configurar Restricciones (Opcional pero Recomendado)
1. Haz clic en tu API Key
2. En **API restrictions**, selecciona:
   - ✅ Address Validation API
   - ✅ Maps JavaScript API
   - ✅ Distance Matrix API
   - ✅ Places API
3. Guarda los cambios

---

## 💰 PASO 3: Verificar Facturación

### 3.1 Habilitar Facturación
La Address Validation API requiere facturación habilitada:
1. Ve a: **Billing** en Google Cloud Console
2. Si no tienes facturación, sigue las instrucciones para habilitarla
3. Google ofrece $200 USD de crédito mensual gratis

### 3.2 Costos
- **Address Validation API**: ~$0.0075 USD por validación
- Con el crédito gratuito puedes validar ~26,000 direcciones/mes

---

## ✅ PASO 4: Probar la Validación

### 4.1 Verificar en el Checkout
1. Ve a tu ecommerce
2. Agrega productos al carrito
3. Ve a checkout
4. Escribe una dirección
5. Deberías ver:
   - 🔍 "Validando dirección..." (mientras valida)
   - ✅ "Dirección válida" (si es correcta)
   - ⚠️ "Dirección no válida" (si hay problemas)

### 4.2 Verificar Logs
En la consola del servidor deberías ver:
```
✅ Dirección válida - Distancia: X km, Costo: $Y
```

---

## 🔍 Cómo Funciona

### Flujo de Validación:
1. Usuario escribe dirección → Autocompletado sugiere
2. Usuario selecciona → Address Validation API valida
3. Si es válida → Se calcula distancia y costo de envío
4. Si no es válida → Se muestra error y se pide corrección

### Niveles de Validación:
- **CONFIRMED**: Dirección completamente válida y confirmada
- **UNCONFIRMED_BUT_PLAUSIBLE**: Probablemente válida pero sin confirmar
- **UNCONFIRMED_AND_SUSPICIOUS**: Puede tener errores

---

## ⚠️ Solución de Problemas

### Error: "Address Validation API is not enabled"
**Solución:**
1. Ve a Google Cloud Console
2. APIs & Services → Library
3. Busca "Address Validation API"
4. Haz clic en "ENABLE"

### Error: "Billing is not enabled"
**Solución:**
1. Ve a Billing en Google Cloud
2. Sigue las instrucciones para habilitar facturación
3. Google ofrece $200 USD de crédito gratis/mes

### Error: "Invalid API key"
**Solución:**
1. Verifica que la API key esté en `.env.local`
2. Verifica que la key tenga habilitada Address Validation API
3. Verifica restricciones de la key

### La validación no funciona pero otras APIs sí
**Solución:**
- Asegúrate de que Address Validation API esté específicamente habilitada
- Es una API diferente de Places API o Distance Matrix API

---

## 📊 Monitoreo de Uso

### Ver Uso de la API:
1. Ve a: **APIs & Services** → **Dashboard**
2. Selecciona **Address Validation API**
3. Verás estadísticas de uso y costos

---

## ✅ Checklist Final

- [ ] Address Validation API habilitada en Google Cloud
- [ ] API Key configurada en `.env.local`
- [ ] Facturación habilitada (requerida)
- [ ] Probar validación en checkout
- [ ] Verificar que aparezca mensaje de validación
- [ ] Verificar que calcule distancia correctamente
- [ ] Verificar que no permita proceder sin dirección válida

---

## 🎉 ¡Listo!

Ahora tu checkout tiene:
- ✅ Autocompletado de direcciones (Google Places)
- ✅ Validación de direcciones (Address Validation API)
- ✅ Cálculo automático de distancia y costo
- ✅ Prevención de direcciones inválidas

**Cada dirección será validada antes de permitir el pago** 🚀

