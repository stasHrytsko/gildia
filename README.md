# Gildia — AI Operations Engineering

Responsive, single-page agency website. Visual story: Complexity → Flow → Structure.

## Visual design

1. Hero ring — tangled lines and scattered dots gradually become an ordered circular system.
2. Data flow — disconnected inputs converge into a controlled and measurable operation.
3. Engineered structure — chaotic particles pass through progressively ordered layers.

The animations use Canvas 2D, not images, video, or an external animation library. Reduced-motion preferences are respected.

## Stack

Plain HTML, CSS, and vanilla JavaScript. No build tools or dependencies to install. The optional DM Sans font loads from Google Fonts.

## Local preview

Open index.html directly, or start a local web server using: python3 -m http.server 8000
Then visit http://localhost:8000

## GitHub Pages

Open Settings > Pages. Choose Deploy from a branch, select main and /(root), then save.
GitHub will show the published URL when deployment completes.

## Booking and contact setup

Edit config.js before launch:
window.GILDIA_CONFIG = { contactEmail: 'your-real-address', bookingUrl: 'your-real-booking-URL' };

When a verified booking URL is supplied, the top booking CTA opens it.
When a verified contact email is supplied, the enquiry opens the visitor's email app with the message pre-filled (sending still requires user action).
Without an email address, the form lets visitors copy the prepared message. It never claims to have sent an enquiry.
No analytics, trackers, cookies, or contact backend are included.

## Content integrity

Three selected engineering projects are shown: AI incident monitoring, medical document processing, and an AI bookkeeping agent.
There are no fabricated results, fake client logos, or promised financial outcomes.

## Files

- index.html — structured page content and metadata.
- styles.css — responsive design system.
- script.js — Canvas animations, navigation and enquiry interactions.
- config.js — contact and booking configuration.
- favicon.svg — vector brand icon.

## Palette

Paper #F8F7F3; Ink #191919; Accent #F4764C; Dark #171819.

© Gildia.