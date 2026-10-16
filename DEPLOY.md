# Deploy SundayWeb

## Render (API)

1. Connect the repository to Render and create a Blueprint from `render.yaml`, or create a Web Service with root directory `server`, build command `npm install`, and start command `npm start`.
2. Set the secret environment variables in the Render dashboard. `MONGODB_URI` must point to a reachable MongoDB Atlas database; allow the Render service to connect in Atlas Network Access. `JWT_SECRET` must be a long random value.
3. Set `CLIENT_URL` to the Vercel production origin (include any custom domain as a comma-separated origin if needed).
4. Set the VNPay values from the matching sandbox or production merchant account. Set `VNPAY_RETURN_URL` to `https://<render-service>.onrender.com/api/payments/vnpay/return`. Configure the VNPay IPN URL to `https://<render-service>.onrender.com/api/payments/vnpay/ipn` in the merchant portal.
5. Confirm `https://<render-service>.onrender.com/api/health` returns a successful response.

For email, image uploads, and CAPTCHA, also set `SMTP_*` / `EMAIL_FROM`, `CLOUDINARY_*`, and `TURNSTILE_SECRET_KEY` / `TURNSTILE_ALLOWED_HOSTNAMES`. Set only integrations you intend to use.

The Blueprint marks secrets as `sync: false`, so fill them in the Render dashboard. Do not commit `.env` files or live payment credentials.

## Vercel (client)

1. Import the same repository as a Vercel project and set the project root to `client`.
2. Use `npm run build` as the build command and `dist` as the output directory (Vercel detects Vite automatically too).
3. Set `VITE_API_URL` to `https://<render-service>.onrender.com/api` for Production, Preview, and Development environments as appropriate, then redeploy.
4. Copy the Vercel production origin into Render's `CLIENT_URL` and redeploy the API.
5. If registration CAPTCHA is enabled, set `VITE_TURNSTILE_SITE_KEY` in Vercel and redeploy the client.

`client/vercel.json` provides the SPA fallback so direct navigation to React routes works after deployment.

## Local setup

Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`, then fill in local credentials. Use the VNPay sandbox URL and sandbox merchant credentials when testing. The callback URLs must point to the publicly reachable API, so local VNPay testing needs a tunnel; do not use the browser app URL for `VNPAY_RETURN_URL`.
