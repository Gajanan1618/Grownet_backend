# GrowNet API

Express + Drizzle ORM + Postgres. JWT auth, phone OTP (demo mode).

## Local development

Needs a local Postgres (or any reachable one — Neon works fine for local dev too).

```bash
copy .env.example .env      # Windows (macOS/Linux: cp)
# edit .env: set DATABASE_URL to your local/dev Postgres
npm install
npm run dev                 # runs migrations automatically on start
```

Log in with any 10-digit number; the OTP is shown on screen (DEMO_MODE=true).

## Deploying (Render + Neon)

See the top-level launch guide for the full click-by-click steps. Short version:

1. Create a Neon project, copy its pooled connection string into `DATABASE_URL`.
2. Push this repo to GitHub, create a Render Web Service from it — `render.yaml` in this
   folder pre-fills the build/start commands and health check.
3. Set `DATABASE_URL`, `CORS_ORIGIN` (your Netlify URL) and a real `JWT_SECRET` in Render's
   environment tab.
4. Migrations run automatically on boot (`runMigrations()` in `src/lib/db.js`).

## Endpoints

| Method | Path | Auth |
|---|---|---|
| POST | /api/auth/send-otp, verify-otp, complete-signup | – |
| GET | /api/auth/me | ✔ |
| PATCH | /api/users/me | ✔ |
| POST | /api/users/me/email/send, /confirm | ✔ |
| GET | /api/listings, /api/requirements | – |
| POST | /api/listings (farmer), /api/requirements (buyer) | ✔ |
| POST | /api/listings/:id/offers, /api/requirements/:id/offers | ✔ |

## Known dev-only shortcuts (fix before real scale)

- JWT lives in localStorage on the frontend → move to httpOnly cookies.
- Photos are base64 in Postgres → move to S3/R2 once storage or request-size becomes an issue
  (the frontend already downsizes photos client-side to delay this).
- OTP codes are stored in Postgres with a 5-minute expiry (no cleanup job yet — harmless at
  this scale, add a cron/`DELETE ... WHERE expires_at < now()` later).
- `DEMO_MODE=true` returns the OTP in the API response — turn this off and wire a real SMS
  provider (MSG91/Twilio/Gupshup) before real users sign up.
- Offers only increment a counter — there's no Offer/Deal table yet. That's the next thing to
  add before payments/escrow per the architecture doc.
