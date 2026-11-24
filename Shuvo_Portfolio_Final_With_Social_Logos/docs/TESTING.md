# Ivory Portfolio — Tested Version (2026-11-24)

**Environment:** headless Chromium; pages rendered using project HTML, CSS, JavaScript and original photo injected locally because file:// URL navigation is blocked in this execution environment.

**Automated results:** **251/251 passed**, 0 JavaScript page errors. This covers:

- All six pages at 1440, 1024, 768 and 390px widths
- `#fffcec` background and **no dark-mode switch** on every page
- No horizontal overflow, six-page menu and heading structure
- Original photo loaded with unchanged source bytes; fade overlay verified
- Mobile menu open/Escape close; project filters (Python, Firebase, All)
- AI Agents learning skill preserved
- Contact form required-field rejection and valid email-draft generation (not real sending)
- Internal links and CV file existence

**Screenshots:** `docs/cream-previews/` contains actual browser screenshots for Home, About, Skills, Projects, Research and Contact at desktop width, plus mobile examples.

**Not tested:** Firefox, GitHub Pages deployment, remote website uptime, real-device usability, actual email-client sending. These need manual checks.

**Academic report caveat:** the included `docs/StudentID_Portfolio.pdf` is from an older design and should be updated with the new screenshots before assignment submission.


## Final Contact image removal — 2026-11-24
The Contact portrait element was removed. Chromium rendering was checked using the complete HTML/CSS/JS in-memory because local URL navigation was restricted in the test environment. 36/36 checks passed across desktop (1440px), tablet (768px), and mobile (390px), covering the absence of the photo, contact cards, form validation and draft preparation, responsive layout, mobile navigation, and unchanged page availability. GitHub Pages deployment remains untested. Current Contact previews are in `docs/final-contact-previews/`.
