import { Resend } from 'resend';

// Inicializar Resend solo cuando se necesite
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY no está configurada');
  }
  return new Resend(apiKey);
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    image_url?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryDate: string;
  deliveryRoute: string;
  deliveryAddress: string;
  recipientName: string;
  recipientPhone: string;
  senderName?: string;
  dedicationMessage?: string;
  stripeSessionId: string;
}

export async function sendOrderConfirmationEmail(orderData: OrderData) {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'La Casita de las Flores <noreply@lacasitadelasflores.mx>',
      to: [orderData.customerEmail],
      subject: `🌹 Confirmación de Pedido #${orderData.orderId} - La Casita de las Flores`,
      html: generateOrderConfirmationHTML(orderData),
    });

    if (error) {
      console.error('Error enviando email de confirmación:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email de confirmación enviado:', data?.id);
    return { success: true, emailId: data?.id };
  } catch (error: any) {
    console.error('Error crítico enviando email:', error);
    return { success: false, error: error.message };
  }
}

function generateOrderConfirmationHTML(orderData: OrderData): string {
  const deliveryTimeText = orderData.deliveryRoute === 'matutina' 
    ? 'Matutina (9:00 AM - 2:30 PM)' 
    : 'Vespertina (2:30 PM - 6:00 PM)';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f3f4f6;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #ec4899;
          margin-bottom: 10px;
        }
        .order-number {
          background: linear-gradient(135deg, #ec4899, #f97316);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          display: inline-block;
          margin-top: 10px;
        }
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #ec4899;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #374151;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        .section-title::before {
          content: "🌹";
          margin-right: 8px;
        }
        .item {
          display: flex;
          align-items: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          margin-bottom: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          margin-right: 15px;
          object-fit: cover;
        }
        .item-details {
          flex: 1;
        }
        .item-title {
          font-weight: bold;
          color: #374151;
          margin-bottom: 5px;
        }
        .item-quantity {
          color: #6b7280;
          font-size: 14px;
        }
        .item-price {
          font-weight: bold;
          color: #ec4899;
          font-size: 16px;
        }
        .total-section {
          background: linear-gradient(135deg, #ec4899, #f97316);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          margin: 25px 0;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          margin-top: 10px;
        }
        .delivery-info {
          background: #f0f9ff;
          border-left-color: #0ea5e9;
        }
        .dedication-info {
          background: #fef3c7;
          border-left-color: #f59e0b;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .contact-info {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .status-badge {
          background: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌹 La Casita de las Flores</div>
          <div class="order-number">Pedido #${orderData.orderId}</div>
          <div class="status-badge">✅ PAGADO EXITOSAMENTE</div>
        </div>

        <div class="section">
          <div class="section-title">Información del Cliente</div>
          <p><strong>Nombre:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          ${orderData.customerPhone ? `<p><strong>Teléfono:</strong> ${orderData.customerPhone}</p>` : ''}
        </div>

        <div class="section">
          <div class="section-title">Productos Pedidos</div>
          ${orderData.items.map(item => `
            <div class="item">
              ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" class="item-image">` : ''}
              <div class="item-details">
                <div class="item-title">${item.title}</div>
                <div class="item-quantity">Cantidad: ${item.quantity}</div>
              </div>
              <div class="item-price">$${(item.price * item.quantity).toFixed(2)} MXN</div>
            </div>
          `).join('')}
        </div>

        ${orderData.senderName || orderData.dedicationMessage ? `
        <div class="section dedication-info">
          <div class="section-title">Datos de la Dedicatoria</div>
          ${orderData.senderName ? `<p><strong>Quien envía:</strong> ${orderData.senderName}</p>` : '<p><strong>Quien envía:</strong> Anónimo</p>'}
          <p><strong>Quien recibe:</strong> ${orderData.recipientName}</p>
          ${orderData.dedicationMessage ? `<p><strong>Mensaje:</strong> "${orderData.dedicationMessage}"</p>` : ''}
        </div>
        ` : ''}

        <div class="section delivery-info">
          <div class="section-title">Información de Entrega</div>
          <p><strong>Fecha de entrega:</strong> ${new Date(orderData.deliveryDate).toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p><strong>Horario:</strong> ${deliveryTimeText}</p>
          <p><strong>Dirección:</strong> ${orderData.deliveryAddress}</p>
          <p><strong>Teléfono de contacto:</strong> ${orderData.recipientPhone}</p>
        </div>

        <div class="total-section">
          <div>💰 Total del Pedido</div>
          <div class="total-amount">$${orderData.total.toFixed(2)} MXN</div>
          <div style="margin-top: 10px; font-size: 14px;">
            Subtotal: $${orderData.subtotal.toFixed(2)} MXN<br>
            Envío: ${orderData.shippingCost === 0 ? 'Gratis' : `$${orderData.shippingCost.toFixed(2)} MXN`}
          </div>
        </div>

        <div class="contact-info">
          <h3 style="margin-top: 0; color: #374151;">📞 ¿Necesitas ayuda?</h3>
          <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:</p>
          <p><strong>WhatsApp:</strong> +52 33 2280 7617</p>
          <p><strong>Email:</strong> contacto@lacasitadelasflores.mx</p>
        </div>

        <div class="footer">
          <p>Gracias por elegir <strong>La Casita de las Flores</strong> 🌹</p>
          <p>Tu pedido está siendo preparado con mucho amor y cuidado.</p>
          <p style="font-size: 12px; margin-top: 15px;">
            ID de transacción: ${orderData.stripeSessionId}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default getResendClient;
