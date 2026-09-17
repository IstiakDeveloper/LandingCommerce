# দোকানদারি (DokanDari)

Facebook-e order neya seller der jonno Bangla-first shop link + picture dashboard.

## Run

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo

- Shop: `/s/demo`
- Seller login: phone `01700000000` PIN `1234`
- Try dashboard (no login): `/try`
- Admin: `/admin/login` PIN `123456` (see `.env` `ADMIN_PIN`)

## Stack

Next.js 15 · TypeScript · Tailwind v4 · Prisma SQLite (swap `DATABASE_URL` to Postgres in production) · next-intl (bn default)

SQLite is for local zero-setup. Production: PostgreSQL, same Prisma schema.
