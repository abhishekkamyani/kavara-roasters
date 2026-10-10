# Kavara Roasters — wholesale portal

B2B ordering portal and admin CRM for a coffee roaster. Cafés sign in to see
the catalog at their tier's price and place wholesale orders; admins manage
orders and add products.

Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Shadcn UI ·
MongoDB/Mongoose · NextAuth v5 (Credentials) · UploadThing · Framer Motion ·
Zustand.

## Setup

```bash
npm install
cp .env.example .env   # then fill it in
npm run seed
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable            | What it is                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `MONGODB_URI`       | MongoDB connection string, including the database name.                                      |
| `AUTH_SECRET`       | NextAuth session secret. Generate one with `npx auth secret`.                                |
| `AUTH_TRUST_HOST`   | Set to `true` when running `next start` outside Vercel (for example on localhost).           |
| `UPLOADTHING_TOKEN` | UploadThing token from Dashboard → API Keys.                                                 |

The installed UploadThing SDK (v7) reads a single `UPLOADTHING_TOKEN`. It
replaces the `UPLOADTHING_SECRET` / `UPLOADTHING_APP_ID` pair used by older
SDK versions, which this app does not read.

### Seed data

`npm run seed` is safe to run again. Accounts and products are upserted
(matched on email and product name), and each sample order is only inserted if
it is missing, so a status you changed in the admin portal is kept. Data you
created yourself is left alone.

Every seeded account uses the password `password123`.

| Account                      | Email                 | Tier   |
| ---------------------------- | --------------------- | ------ |
| Kavara Roasters HQ (admin)   | `admin@kavara.com`    | —      |
| Gold Leaf Café               | `cafe@gold.com`       | Gold   |
| Silver Spoon Espresso Bar    | `cafe@silver.com`     | Silver |
| Bronze Kettle Coffee House   | `cafe@bronze.com`     | Bronze |
| Harbour Street Roastery Café | `harbour@example.com` | Silver |
| Juniper & Rye Bakery         | `juniper@example.com` | Bronze |

Plus five coffees and twelve sample orders spread across the clients, from
August to October 2026, in a mix of Pending, Invoiced and Shipped. Change
these passwords before using a seeded database for anything real.

## How it works

**Pricing.** Each product has a base price per kg. Clients pay
Bronze = base, Silver = 10% off, Gold = 15% off (`lib/pricing.ts`). The catalog
shows the base price struck through next to the client's price. At checkout
the server re-prices every line from the database, so the amount on the order
never depends on what the browser sent.

**Minimum order.** A checkout must total at least 5kg
(`CHECKOUT_MOQ_KG` in `lib/constants.ts`). The cart shows how many kg are
missing and keeps the order button disabled until then; the `placeOrder`
Server Action enforces the same rule, along with each product's own minimum.

**Access control.** `proxy.ts` (the Next.js 16 name for `middleware.ts`)
redirects signed-out visitors to `/login` and keeps clients out of `/admin`
and admins out of `/dashboard`. Pages and Server Actions check the session
again through `lib/dal.ts` rather than relying on the proxy.

**Accounts.** There is no public sign-up. An admin creates each client on
`/admin/clients/new` with a starting password and a tier, and can change the
tier later; the new pricing applies on the client's next page load.

**Uploads.** `/admin/products/new` uploads the image straight to UploadThing
(`app/api/uploadthing/core.ts`, admins only, images up to 4MB) and stores the
returned URL on the product. In development UploadThing confirms uploads
through the browser. In production its servers call
`/api/uploadthing` back, so the app must be reachable from the internet —
an upload against `next start` on localhost will wait forever.

## Routes

| Route                 | Who    | What                                             |
| --------------------- | ------ | ------------------------------------------------ |
| `/`                   | Public | Landing page                                     |
| `/login`              | Public | Sign in                                          |
| `/dashboard`          | Client | Catalog with tier pricing and the cart drawer    |
| `/dashboard/orders`   | Client | Past orders and invoices                         |
| `/admin/orders`       | Admin  | All orders, with status updates                  |
| `/admin/clients`      | Admin  | Client accounts, with tier changes               |
| `/admin/clients/new`  | Admin  | Create a client account                          |
| `/admin/products`     | Admin  | Product list, with edit and delete               |
| `/admin/products/new` | Admin  | Add a product with an image upload               |
| `/admin/products/[id]/edit` | Admin | Edit a product or replace its image         |

## Scripts

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run seed`  | Seed the demo accounts and products  |
| `npm run lint`  | ESLint                               |

## Developer

Built and maintained by **Abhishek Kumar Kamyani**, a Full Stack Developer from
Pakistan with 2+ years of experience building web products with React, Next.js
and Node.js.

- **Currently:** Full Stack Developer (Next.js) at AlFactor Inc., plus freelance work
- **Education:** BS Computer Science, Sukkur IBA University
- **Skills:** React, Next.js, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, REST APIs, Jest, Playwright, Docker, CI/CD
- **Other projects:** Sareer Publication Admin Panel (MERN), Tone Shift AI, AI Chef Mate (React Native)

**Contact**

- Portfolio: https://abhishekkamyani.vercel.app/
- Email: abhishekkamyani@gmail.com
- LinkedIn: https://linkedin.com/in/abhishekkamyani
