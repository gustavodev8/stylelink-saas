const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email de boas-vindas
const sendWelcomeEmail = async (email, storeName, storeSlug) => {
  const mailOptions = {
    from: `"StyleLink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Bem-vindo ao StyleLink!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Bem-vindo ao StyleLink, ${storeName}!</h1>
        <p>Sua conta foi criada com sucesso!</p>
        <p>Agora você pode começar a adicionar seus produtos e personalizar sua página.</p>
        <p><strong>Seu link público:</strong> <a href="${process.env.FRONTEND_PUBLIC_URL}/${storeSlug}">${process.env.FRONTEND_PUBLIC_URL}/${storeSlug}</a></p>
        <p>Você tem <strong>7 dias de teste grátis</strong> para explorar todas as funcionalidades.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Equipe StyleLink<br>
          Se você não criou esta conta, por favor ignore este email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de boas-vindas enviado para:', email);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};

// Email de confirmação de pagamento
const sendPaymentConfirmation = async (email, amount, nextBillingDate) => {
  const mailOptions = {
    from: `"StyleLink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Pagamento Confirmado - StyleLink',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Pagamento Confirmado!</h1>
        <p>Recebemos seu pagamento de <strong>R$ ${amount.toFixed(2)}</strong>.</p>
        <p>Sua assinatura está ativa e seu próximo pagamento será em: <strong>${nextBillingDate}</strong></p>
        <p>Obrigado por confiar no StyleLink!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Equipe StyleLink
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de confirmação enviado para:', email);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};

// Email de lembrete de renovação
const sendRenewalReminder = async (email, storeName, daysRemaining) => {
  const mailOptions = {
    from: `"StyleLink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Lembrete: Renovação da sua assinatura',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Olá, ${storeName}!</h1>
        <p>Sua assinatura vence em <strong>${daysRemaining} dias</strong>.</p>
        <p>Para continuar usando o StyleLink sem interrupções, certifique-se de que seu pagamento está em dia.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Equipe StyleLink
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de lembrete enviado para:', email);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPaymentConfirmation,
  sendRenewalReminder
};
