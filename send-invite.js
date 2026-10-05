// send-invite.js
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const html = fs.readFileSync(path.join(__dirname, 'email', 'index.html'), 'utf8');

const img = (file, type, id) => ({
  content: fs.readFileSync(path.join(__dirname, 'email', file)).toString('base64'),
  filename: file,
  type,
  disposition: 'inline',
  content_id: id,
});

const invitados = [
  { email: 'e.gonzalez@vincicompass.com', name: 'Eva' },
  { email: 'a.villagra@vincicompass.com', name: 'Agustín' }

];

const mensajes = invitados.map((invitado) => ({
  from: { email: 'operationsinbox@info.vincicompass.com', name: 'Global Operations' },
  to: invitado, // un solo destinatario por correo
  cc: 'vnavarro@vincicompass.com',
  subject: 'Invitación: Operations Offsite',
  text: `Hola ${invitado.name}, estás invitado al Operations Offsite.`,
  html: html.replace('{{nombre}}', invitado.name), // opcional: personaliza el saludo
  attachments: [
    img('invitation.gif', 'image/gif', 'invitation'),
    img('btn-calendar.png', 'image/png', 'btn-calendar'),
    img('btn-topics.png', 'image/png', 'btn-topics'),
  ],
}));

sgMail
  .send(mensajes)
  .then(() => console.log(`${mensajes.length} correos enviados`))
  .catch((err) => console.error(err.response?.body || err));