import { sendMail } from '../nodemailer.config';

export async function sendVerificationEmail(to: string, link: string) {
  const html = `
    <h3>Verifikasi Email Anda</h3>
    <p>Klik link berikut untuk memverifikasi akun Anda dan membuat password:</p>
    <a href="${link}">${link}</a>
    <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
  `;

  await sendMail({
    to,
    subject: 'Verifikasi Email Roomfinder',
    html,
  });
}
