const fs = require('fs');
const path = require('path');

const emailDir = path.join(__dirname, 'email');
const siteUrl = 'https://vc-operationsteam.github.io/Operations-Offsite/';
const outputPath = path.join(emailDir, 'Offsite-invitation-email.eml');
const outerBoundary = '----=_VinciCompass_OperationsOffsite_Alternative_2026';
const relatedBoundary = '----=_VinciCompass_OperationsOffsite_Related_2026';
const invitationCid = 'invitation-image@vincicompass';
const meetingSiteCid = 'access-meeting-site@vincicompass';

function quotedPrintable(value) {
  return value
    .replace(/\r?\n/g, '\n')
    .split('\n')
    .map((line) => {
      const tokens = [];
      for (const byte of Buffer.from(line, 'utf8')) {
        const safe = (byte >= 33 && byte <= 60) || (byte >= 62 && byte <= 126);
        tokens.push(safe ? String.fromCharCode(byte) : `=${byte.toString(16).toUpperCase().padStart(2, '0')}`);
      }

      const wrapped = [];
      let current = '';
      for (const token of tokens) {
        if (current.length + token.length > 75) {
          wrapped.push(`${current}=`);
          current = '';
        }
        current += token;
      }
      wrapped.push(current);
      return wrapped.join('\r\n');
    })
    .join('\r\n');
}

function base64Lines(filePath) {
  return fs.readFileSync(filePath).toString('base64').match(/.{1,76}/g).join('\r\n');
}

function inlineImage({ contentType, fileName, cid }) {
  return [
    `Content-Type: ${contentType}; name="${fileName}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: inline; filename="${fileName}"`,
    `Content-ID: <${cid}>`,
    'MIME-Version: 1.0',
    '',
    base64Lines(path.join(emailDir, fileName)),
  ].join('\r\n');
}

let html = fs.readFileSync(path.join(emailDir, 'index.html'), 'utf8');
html = html
  .replace(`${siteUrl}email/invitation.gif`, `cid:${invitationCid}`)
  .replace(`${siteUrl}email/btn-calendar.png`, `cid:${meetingSiteCid}`);

if (html.includes(`${siteUrl}email/`) || html.includes('btn-topics.png')) {
  throw new Error('The email still contains an unexpected remote or View topics image.');
}

const plainText = [
  'You are invited to the Vinci Compass First Operations Offsite — Rio de Janeiro, November 10–12, 2026.',
  `Meeting site: ${siteUrl}`,
].join('\n');

const message = [
  'Subject: Destination set: Rio de Janeiro - First Operations Offsite',
  'X-Unsent: 1',
  'MIME-Version: 1.0',
  `Content-Type: multipart/alternative; boundary="${outerBoundary}"`,
  '',
  `--${outerBoundary}`,
  'Content-Type: text/plain; charset="utf-8"',
  'Content-Transfer-Encoding: quoted-printable',
  '',
  quotedPrintable(plainText),
  `--${outerBoundary}`,
  'MIME-Version: 1.0',
  `Content-Type: multipart/related; boundary="${relatedBoundary}"`,
  '',
  `--${relatedBoundary}`,
  'Content-Type: text/html; charset="utf-8"',
  'Content-Transfer-Encoding: quoted-printable',
  '',
  quotedPrintable(html),
  `--${relatedBoundary}`,
  inlineImage({ contentType: 'image/gif', fileName: 'invitation.gif', cid: invitationCid }),
  `--${relatedBoundary}`,
  inlineImage({ contentType: 'image/png', fileName: 'btn-calendar.png', cid: meetingSiteCid }),
  `--${relatedBoundary}--`,
  `--${outerBoundary}--`,
  '',
].join('\r\n');

fs.writeFileSync(outputPath, message, 'utf8');
console.log(`Created ${outputPath}`);
