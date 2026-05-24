# Respiratory Care Weekly Challenge

Open **`index.html`** for the landing page, or **`Challenge.html`** for the full app (quiz + admin).

## Files

- **index.html** — welcome / join (mobile-friendly)
- **Challenge.html** — quiz, leaderboard, admin
- **firebase-config.js** — cloud sync settings (copy from `firebase-config.example.js`)
- **js/cloud-sync.js** — syncs questions, results, and settings for all users
- **media/** — images (`Background.png`, `Back.png`, `nurse.png`, …)

## Shared data for everyone (Firebase)

By default, data stays in each browser only (`localStorage`). To make **questions, results, and settings visible on every phone and PC**:

1. Create a free project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** (start in test mode, then publish rules from `firestore.rules.example` or set your own)
3. Project settings → Your apps → Web app → copy the `firebaseConfig` object
4. Copy `firebase-config.example.js` to `firebase-config.js` and paste your config
5. Host the folder (GitHub Pages, Netlify, or any static host) and open the site from the same URL for all staff

When connected, the top bar shows **☁️ Live — shared**. Admin results and leaderboard update when anyone finishes a challenge.

**Security note:** Example Firestore rules allow public read/write for simplicity. For a real hospital deployment, use Firebase Authentication and stricter rules. Do not commit real API keys to a public repo if the database is open.

## Local-only mode

Leave `window.FIREBASE_CONFIG = null` in `firebase-config.js` — the app works as before on each device only.
