// send-invite.js
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const html = fs.readFileSync(
  path.join(__dirname, 'email', 'index.html'),
  'utf8'
);

const msg = {
  to: ['e.gonzalez@vincicompass.com', 'a.villagra@vincicompass.com'],
  cc: 'vnavarro@vincicompass.com',
  from:{
    email:'operationsinbox@info.vincicompass.com',
    name: 'Global Operations'},
  subject: 'Invitación: Operations Offsite',
  text: 'Estás invitado al Operations Offsite.',
  html: html,
};

sgMail
  .send(msg)
  .then(() => console.log('Correo enviado'))
  .catch((err) => console.error(err.response?.body || err));