# 📱 Configuración de WhatsApp Automático

## 🎯 Problema Solucionado
El sistema ahora puede enviar mensajes de WhatsApp automáticamente cuando se completa una compra exitosa.

## 🔧 Configuración Rápida (2 opciones)

### Opción 1: Twilio WhatsApp (Recomendado - Automático)
```bash
1. Ve a https://console.twilio.com/
2. Crea una cuenta gratuita
3. Ve a "Messaging" → "Try it out" → "Send a WhatsApp message"
4. Sigue las instrucciones para configurar WhatsApp Sandbox
5. Copia tus credenciales:
   - Account SID
   - Auth Token
   - Número de WhatsApp Sandbox (ej: +14155238886)
```

### Opción 2: Método Manual (Sin configuración)
El sistema ya funciona sin configuración adicional. Cuando no hay Twilio configurado:
- Muestra el mensaje en la consola del servidor
- Genera una URL de WhatsApp Web para envío manual

## 📝 Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# Twilio WhatsApp (Notificaciones automáticas)
TWILIO_ACCOUNT_SID=tu-account-sid-aqui
TWILIO_AUTH_TOKEN=tu-auth-token-aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+523322807617
```

## 🚀 Cómo Funciona

1. **Cliente completa compra** → Stripe procesa pago
2. **Webhook se activa** → Sistema detecta pago exitoso
3. **Se busca la orden** → Se obtienen todos los datos
4. **Se envía WhatsApp** → Mensaje automático con todos los detalles
5. **Se actualiza estado** → Orden marcada como "paid"

## 📋 Contenido del Mensaje

El mensaje incluye:
- ✅ Datos del cliente (nombre, email, teléfono)
- ✅ Información de dedicatoria
- ✅ Datos de entrega (dirección, fecha, ruta)
- ✅ Resumen del pedido con productos
- ✅ Total pagado
- ✅ ID de sesión Stripe
- ✅ Instrucciones de entrega

## 🔍 Verificar Funcionamiento

### Con Twilio configurado:
- Los mensajes se envían automáticamente
- Aparece "✅ Mensaje de WhatsApp enviado exitosamente" en logs

### Sin Twilio:
- Aparece "⚠️ Twilio no configurado, usando método alternativo"
- Se genera URL para envío manual
- Mensaje completo en consola del servidor

## 🛠️ Solución de Problemas

### Error: "Twilio no configurado"
- Verifica que las variables de entorno estén en `.env.local`
- Reinicia el servidor después de agregar las variables

### Error: "Invalid phone number"
- Verifica que el número tenga formato: `whatsapp:+523322807617`
- El número debe incluir código de país (+52 para México)

### Mensaje no llega
- Verifica que el número de destino sea correcto
- En sandbox de Twilio, solo funciona con números verificados

## 💡 Notas Importantes

- **Twilio Sandbox**: Gratuito para pruebas, limitado a números verificados
- **Producción**: Requiere aprobación de Meta para WhatsApp Business API
- **Fallback**: Sistema funciona sin Twilio usando método manual
- **Número objetivo**: 3322807617 (configurado en el código)

## 🎉 ¡Listo!

Una vez configurado, cada compra exitosa enviará automáticamente un mensaje de WhatsApp con todos los detalles del pedido.
