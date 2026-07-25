# Community Newsletter CMS

This frontend is part of a lightweight announcement platform for local communities. It gives admins a simple way to manage public updates while keeping the experience focused and easy to use.

This is an MVP, so the goal is to deliver the core announcement workflow clearly and simply rather than adding heavy editor or publishing features.

## What this app supports

- Admin login and registration
- A protected admin dashboard
- Announcement creation and editing
- A public feed for published posts
- A draft and publish workflow

## Main routes

- /: public announcement feed
- /login: admin login
- /register: admin registration
- /dashboard: admin dashboard
- /editor: create a new announcement
- /editor/:id: edit an existing announcement

## Getting started

```bash
cd client
npm install
npm run dev
```

Make sure the backend is also running so the app can load announcements and authenticate admins.

## Notes

- Published announcements appear on the public feed.
- Draft announcements remain visible only to admins.
- The editor currently supports a lightweight Markdown-style experience with a preview, which fits the MVP scope well.
