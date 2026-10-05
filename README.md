# Vinci Compass · First Operations Offsite

Invitation page and email for the First Operations Offsite (Rio de Janeiro, November 10–12, 2026).

Published with GitHub Pages at https://vc-operationsteam.github.io/Operations-Offsite/

## Page
- `index.html`: landing page with the compass animation, the "Add to my Outlook calendar" button and the topics per day (detailed agenda coming soon).
- `operations-offsite-2026.ics`: three Outlook-compatible appointments, one for each offsite day from 08:30 to 17:30 (Rio time).
- `og-image.png`: preview image shown when the link is shared (Teams, WhatsApp…).
- `vinci-compass-logo.png`: logo / browser icon.

## Email
- `email/index.html`: web version of the email (https://vc-operationsteam.github.io/Operations-Offsite/email/).
- `email/invitation.gif`, `email/btn-calendar.png`: images used by the email.
- `email/Offsite-invitation-email.eml`: ready-to-send email with the images embedded.
  Open it with Outlook (right click → Open With → Microsoft Outlook), click **Forward**, remove the forward header and the "FW:/RV:" prefix, add recipients and send.
- `email/Offsite-invitation-email.htm`: same email as raw HTML, for classic Outlook for Windows:
  new message → Attach File → choose the .htm → arrow next to **Insert** → **Insert as Text**.
  The images are loaded from this site, so the page must be published.
- `npm run build:email`: rebuilds the self-contained `.eml` after changing the email HTML or its images.
