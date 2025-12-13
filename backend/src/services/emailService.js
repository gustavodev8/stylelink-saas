const nodemailer = require('nodemailer');

// Configurar transporter com timeout curto
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  connectionTimeout: 5000, // 5 segundos
  greetingTimeout: 5000,   // 5 segundos
  socketTimeout: 5000       // 5 segundos
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

// Email com código de verificação
const sendVerificationCode = async (email, code, storeName) => {
  const mailOptions = {
    from: `"StyleLink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Código de Verificação - StyleLink',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; margin: 0;">StyleLink</h1>
          <p style="color: #6b7280; margin-top: 5px;">Verificação de Email</p>
        </div>

        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <p style="color: white; font-size: 16px; margin: 0 0 15px 0;">Olá, ${storeName}!</p>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 20px 0;">Use o código abaixo para verificar seu email:</p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 0 auto; display: inline-block;">
            <h2 style="color: #6366f1; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: monospace;">${code}</h2>
          </div>

          <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 15px;">Código válido por 15 minutos</p>
        </div>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #374151;">
            <strong>Por que estou recebendo isso?</strong><br>
            Você (ou alguém) tentou criar uma conta no StyleLink com este email.
            Se não foi você, ignore este email.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
          Equipe StyleLink<br>
          Este é um email automático, não responda.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Código de verificação enviado para:', email);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar código de verificação:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPaymentConfirmation,
  sendRenewalReminder,
  sendVerificationCode
};
