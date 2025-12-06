const mercadopago = require('mercadopago');

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Criar link de pagamento
const createPaymentLink = async (userEmail, userName, amount = 79.90) => {
  try {
    const preference = {
      items: [
        {
          title: 'Assinatura StyleLink - Mensal',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: amount
        }
      ],
      payer: {
        email: userEmail,
        name: userName
      },
      back_urls: {
        success: `${process.env.FRONTEND_ADMIN_URL}/payment/success`,
        failure: `${process.env.FRONTEND_ADMIN_URL}/payment/failure`,
        pending: `${process.env.FRONTEND_ADMIN_URL}/payment/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
      external_reference: userEmail
    };

    const response = await mercadopago.preferences.create(preference);
    return {
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    };
  } catch (error) {
    console.error('Erro ao criar link de pagamento:', error);
    throw error;
  }
};

// Verificar status do pagamento
const checkPaymentStatus = async (paymentId) => {
  try {
    const payment = await mercadopago.payment.get(paymentId);
    return {
      status: payment.body.status,
      status_detail: payment.body.status_detail,
      transaction_amount: payment.body.transaction_amount,
      payment_method_id: payment.body.payment_method_id,
      date_approved: payment.body.date_approved
    };
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    throw error;
  }
};

module.exports = {
  createPaymentLink,
  checkPaymentStatus
};
