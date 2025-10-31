# 📱 Guía Completa: Integración de Twilio WhatsApp

## 🎯 Objetivo
Integrar Twilio para enviar mensajes de WhatsApp automáticamente cada vez que se complete una compra en tu ecommerce.

---

## 📋 PASO 1: Crear Cuenta en Twilio

### 1.1 Crear Cuenta
1. Ve a: **https://www.twilio.com/try-twilio**
2. Haz clic en **"Start Free Trial"** (Prueba Gratuita)
3. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña
   - Número de teléfono (para verificación)
4. Verifica tu email y teléfono

### 1.2 Verificar Cuenta
- Twilio te dará crédito gratis ($15 USD) para empezar
- Necesitas verificar tu número de teléfono
- Completa cualquier paso de verificación que aparezca

---

## 📋 PASO 2: Configurar WhatsApp en Twilio

### 2.1 Activar WhatsApp Sandbox (Para Pruebas)
1. **Ve al Dashboard** de Twilio: https://console.twilio.com/
2. En el menú lateral, busca **"Messaging"**
3. Haz clic en **"Try it out"** → **"Send a WhatsApp message"**
4. O ve directamente a: **https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn**

### 2.2 Configurar WhatsApp Sandbox
1. **Twilio te dará un número** tipo: `whatsapp:+14155238886` (este es un número de ejemplo)
2. **Agrega tu número** al Sandbox:
   - En la sección "Join the sandbox"
   - Envía el código que Twilio te indique (ejemplo: `join <codigo>`)
   - Envía este mensaje **desde tu WhatsApp** al número de Twilio
   - Ejemplo: Si te dice "join abc123", envía: `join abc123` al número de Twilio

### 2.3 Verificar Conexión
- Deberías recibir un mensaje de confirmación de Twilio
- Ahora puedes recibir mensajes en tu número desde Twilio

---

## 📋 PASO 3: Obtener Credenciales de Twilio

### 3.1 Account SID y Auth Token
1. Ve al Dashboard: **https://console.twilio.com/**
2. En la página principal verás:
   - **Account SID**: (empieza con `AC...`)
   - **Auth Token**: (haz clic en "View" para verlo)
3. **Copia ambos valores** y guárdalos de forma segura

### 3.2 Número de WhatsApp de Twilio
- El número que te asignó Twilio (ejemplo: `whatsapp:+14155238886`)
- Este número aparece en la sección de WhatsApp Sandbox

---

## 📋 PASO 4: Solicitar Número de Producción (Opcional pero Recomendado)

### Para Producción Real:
1. Ve a: **https://console.twilio.com/us1/develop/sms/senders/whatsapp-learn**
2. Haz clic en **"Get started with WhatsApp"**
3. Completa el formulario:
   - Nombre de tu negocio: "La Casita de las Flores"
   - Categoría: "Retail" o "E-commerce"
   - Descripción: "Floristería en línea con entrega el mismo día"
   - Página web: Tu sitio web
4. **Twilio revisará tu solicitud** (puede tomar 1-3 días)
5. Una vez aprobado, recibirás un número oficial de WhatsApp Business

---

## 📋 PASO 5: Configurar Variables de Entorno

### 5.1 Editar `.env.local`
1. Ve a la carpeta `flores_ecomerce/`
2. Abre el archivo `.env.local` (si no existe, créalo)
3. Agrega estas variables:

```env
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu-auth-token-aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+523322807617
```

### 5.2 Explicación de Variables:
- **TWILIO_ACCOUNT_SID**: Tu Account SID de Twilio (empieza con `AC`)
- **TWILIO_AUTH_TOKEN**: Tu Auth Token de Twilio
- **TWILIO_WHATSAPP_FROM**: El número de Twilio (formato: `whatsapp:+14155238886`)
- **TWILIO_WHATSAPP_TO**: Tu número de WhatsApp donde recibirás las notificaciones (formato: `whatsapp:+523322807617`)

### 5.3 Formato de Números:
- **México**: `whatsapp:+52` + número sin espacios
- Ejemplo: Si tu número es `3322807617`, usa: `whatsapp:+523322807617`

---

## 📋 PASO 6: Probar la Integración

### 6.1 Reiniciar el Servidor
```bash
# Detén el servidor (Ctrl + C)
# Luego reinícialo
npm run dev
```

### 6.2 Probar con un Test
1. Ve a tu ecommerce
2. Haz una compra de prueba
3. Completa el pago
4. Verifica que recibas el mensaje de WhatsApp automáticamente

---

## 📋 PASO 7: Verificar que Funciona

### 7.1 Revisar Logs del Servidor
Cuando se complete una compra, deberías ver en la consola:
```
✅ Mensaje de WhatsApp enviado exitosamente via Twilio
```

### 7.2 Verificar Twilio Dashboard
1. Ve a: **https://console.twilio.com/us1/monitor/logs/sms**
2. Deberías ver los mensajes enviados
3. Revisa el estado: "delivered", "sent", etc.

---

## ⚠️ IMPORTANTE: Costos y Límites

### Sandbox (Gratis para Pruebas):
- ✅ Mensajes **gratis** a números verificados en el sandbox
- ✅ Solo funciona con números agregados al sandbox
- ❌ No funciona en producción real

### Producción (Pago):
- 💰 **$0.005 USD por mensaje** (aproximadamente $0.10 MXN)
- 📊 Ejemplo: 100 mensajes = $0.50 USD
- ⚠️ Requiere solicitar número oficial (Paso 4)

---

## 🔧 Solución de Problemas

### Error: "Unable to create record"
- **Causa**: Credenciales incorrectas
- **Solución**: Verifica `TWILIO_ACCOUNT_SID` y `TWILIO_AUTH_TOKEN`

### Error: "Invalid phone number"
- **Causa**: Formato incorrecto del número
- **Solución**: Asegúrate de usar formato: `whatsapp:+523322807617`

### No recibo mensajes
- **Causa**: Número no agregado al sandbox
- **Solución**: Agrega tu número al WhatsApp Sandbox (Paso 2.2)

### Error: "From number is not a valid WhatsApp-enabled number"
- **Causa**: Número de Twilio incorrecto
- **Solución**: Verifica `TWILIO_WHATSAPP_FROM` en `.env.local`

---

## ✅ Checklist Final

- [ ] Cuenta de Twilio creada y verificada
- [ ] WhatsApp Sandbox configurado
- [ ] Número agregado al sandbox
- [ ] Account SID copiado
- [ ] Auth Token copiado
- [ ] Número de Twilio copiado
- [ ] Variables agregadas a `.env.local`
- [ ] Servidor reiniciado
- [ ] Compra de prueba realizada
- [ ] Mensaje recibido en WhatsApp ✅

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, cada vez que un cliente complete una compra:
1. Stripe procesa el pago
2. El webhook se activa
3. **Twilio envía automáticamente** un mensaje de WhatsApp
4. Recibes la notificación con todos los detalles del pedido

---

## 📞 Soporte

Si tienes problemas:
- **Documentación Twilio**: https://www.twilio.com/docs/whatsapp
- **Dashboard Twilio**: https://console.twilio.com/
- **Status de Twilio**: https://status.twilio.com/

