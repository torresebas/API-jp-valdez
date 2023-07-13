import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //INFO DEL EMAIL
  const info = await transport.sendMail({
    from: '"ADMIN-MERN <admin@admin.com>',
    to: email,
    subject: "Confirm Account",
    text: "Confirm you account",
    html: `<p>Hola ${name} Confirm your account.</p>
    
    <p>Click link:
    
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm account</a>
    </p>
    `,
  });
};

export const emailForgotPassword = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //INFO DEL EMAIL
  const info = await transport.sendMail({
    from: '"ADMIN-MERN <admin@admin.com>',
    to: email,
    subject: "Restore your Password",
    text: "Confirm you account",
    html: `<p>Hi ${name} restore your password.</p>
    
    <p>Click link:
    
    <a href="${process.env.FRONTEND_URL}/password-forgot/${token}">Restore password</a>
    </p>
    `,
  });
};
