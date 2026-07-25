# Community Newsletter CMS

A lightweight announcement platform for local communities that keeps publishing simple. It is designed for neighborhood groups, associations, and small organizations that want to share updates without the overhead of a large content management system.

## Project description

This app provides a straightforward way to publish announcements to the public while keeping admin tools simple and focused. The experience is centered around four core needs:

- Admin authentication for secure access
- A post editor for creating announcements
- A public feed or archive of published posts
- A draft workflow for saving, editing, and publishing content

## Key features

- Admin login and protected dashboard access
- Content creation with a simple editor experience that can evolve into rich text or Markdown support
- Public timeline for published announcements
- Draft, edit, and publish workflow for announcement lifecycle management
- Lightweight setup suitable for small communities and local organizations

## Tech stack

- Frontend: React, TypeScript, Vite, React Router
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT
- Auth: JWT-based admin authentication with protected routes

## Project structure

- client/: React frontend
  - src/pages/: login, register, dashboard, editor, and feed views
  - src/context/: authentication state
  - src/services/: API client helpers
- server/: Express backend
  - src/routes/: auth and announcement endpoints
  - src/models/: Mongoose models
  - src/middleware/: auth middleware

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally or reachable through a connection string

## Setup

1. Install dependencies for both apps:

   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

2. Create a .env file inside the server folder:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/community-newsletter
   JWT_SECRET=change-me
   ```

3. Start the backend:

   ```bash
   cd server
   npm run dev
   ```

4. Start the frontend in a second terminal:

   ```bash
   cd client
   npm run dev
   ```

5. Open the frontend in your browser at the Vite URL shown in the terminal, usually http://localhost:5173.

## Main user flow

- Visit / to view the public feed
- Visit /register to create an admin account
- Visit /login to sign in
- Use /dashboard to create, edit, and manage announcements
- Use /editor to create a new post or /editor/:id to edit an existing one

## API overview

The backend exposes these main routes:

- GET /api/announcements/published: public feed data
- GET /api/announcements: admin-only list of all announcements
- POST /api/announcements: create an announcement
- PUT /api/announcements/:id: update an announcement
- DELETE /api/announcements/:id: delete an announcement
- POST /api/auth/register: register an admin user
- POST /api/auth/login: log in an admin user

## Notes

- The current implementation already supports admin auth, a dashboard, and draft/publish handling.
- The editor experience can be expanded further to support richer Markdown or rich-text formatting in a future iteration.
