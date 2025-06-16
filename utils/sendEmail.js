import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // 'smtp.gmail.com'
  port: Number(process.env.EMAIL_PORT), // 587
  secure: false, // porta 587 usa false
  auth: {
    user: process.env.EMAIL_USER, // teu email
    pass: process.env.EMAIL_PASS, // app password ou senha
  },
  tls: {
    rejectUnauthorized: false, // para evitar erros com TLS no dev
  },
  dns: {
    family: 4,
  },
});

export async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM, // ex: 'no-reply@teusite.com'
    to,
    subject,
    html,
  });
}

export { transporter };
