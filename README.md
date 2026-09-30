# VQ Agent Console

Business-owner console for the 21 VisionQuantech AI-agent n8n workflows (22 webhook endpoints).
No dependencies, no build step — pure HTML/CSS/JS.

## Run

Any static server works:

```bash
cd vq-agent-console
python3 -m http.server 8000
# open http://localhost:8000
```

Or just double-click `index.html` (file:// works for layout; webhook POSTs need http(s) origin for CORS).

## Use

1. Set the **n8n base URL** (default `https://automation-832k.onrender.com`), Save.
2. Pick a group tab (Leads / Chat & Voice / Bookings / Marketing / Operations).
3. Every panel is prefilled with a working sample — hit **Send** to fire a live POST.
4. Read the response (status + ms + pretty JSON). **Copy as cURL** replays the same call from a terminal.

## What is live vs stubbed

- Live: lead scoring, enquiry replies, chat, triage, SDR qualification, document extraction,
  SEO audit, keyword plan, presence plan, booking validation, IVR TwiML, follow-up plans.
- Stubbed until provider keys are connected: actual WhatsApp/SMS/email/call delivery
  (panels draft the message and return it), Google Calendar/Gmail/Sheets (badged
  "Needs Google setup").

## Deploy

Unzip anywhere and serve the folder as static files (Nginx, Apache, Netlify Drop,
Cloudflare Pages, GitHub Pages, Render Static Site). No server code, no secrets —
the n8n base URL lives in the visitor's browser localStorage.
