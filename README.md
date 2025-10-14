# CONOTE
# Collaborative Note Editor — Frontend

Single-page application for a real-time collaborative notes/editor app.

## Tech Stack

- **Framework**: Vue 3 + Vue Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Rich Text**: Quill.js
- **Realtime**: socket.io-client
- **UI/UX**: Swiper, Vue Toastification, Font Awesome

## Node Version

This project targets Node `^20.19.0 || >=22.12.0` (see `package.json → engines`).

## Scripts

- **dev**: `vite` — start the dev server with HMR
- **build**: `vite build` — build for production
- **preview**: `vite preview` — preview the production build

From `frontend/`:

```bash
npm install
npm run dev      # http://localhost:5173 by default
# or
npm run build
npm run preview  # serve the built app locally
```

## Environment Variables

Copy `.env.example` to `.env` and customize as needed. Only variables prefixed with `VITE_` are exposed to the client.

```dotenv
# Example
VITE_APP_NAME="CoNotes"

# Home page project info (optional)
VITE_OWNER_NAME="Your Name"
VITE_LAST_UPDATED="2025-10-04T12:58:44+03:00"
VITE_CONTRIBUTORS_COUNT="3"
```

You can reference these in code via `import.meta.env.VITE_*`.

## Project Structure (key parts)

- `src/`
  - `components/`, `layouts/`, `assets/`
  - Vue Router setup and views
  - Quill editor integration and real-time collaboration hooks
- `public/` — static assets

## Development Notes

- The app connects to the backend for real-time collaboration via Socket.IO (`socket.io-client`). Ensure the backend is running and CORS is configured to allow `http://localhost:5173` (see backend `.env`).
- Tailwind CSS v4 is integrated via `@tailwindcss/vite`.

## Build & Deploy

- Run `npm run build` to generate static assets in `dist/`.
- Serve `dist/` behind any static file server (e.g., Nginx, Vercel, Netlify). If the app relies on a separate API, configure the correct API/CORS in production.

## Demo Examples

Home Page
<img width="1880" height="809" alt="image" src="https://github.com/user-attachments/assets/9efbead0-b3e1-4390-a1b5-99a10b620bb9" />

Dashboard
<img width="1892" height="792" alt="image" src="https://github.com/user-attachments/assets/d59eb1af-477c-41dd-9b1b-0d84d7078660" />


## License

ISC — © Ayman F. Ali
