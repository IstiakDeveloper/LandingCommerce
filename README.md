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

Next.js 15 · TypeScript · Tailwind v4 · Prisma (SQLite & PostgreSQL Docker support) · next-intl (bn default)

## 🔄 Database Switch & Fresh Migration (SQLite ⇋ Docker PostgreSQL)

যেকোনো সময় খুব সহজে SQLite এবং Docker (PostgreSQL) এর মধ্যে সুইচ করতে পারবেন এবং Fresh Migration চালাতে পারবেন:

### ১. স্ট্যাটাস দেখা (কোন DB বর্তমানে অ্যাক্টিভ)
```bash
npm run db:status
```

### ২. SQLite-এ সুইচ করা
```bash
npm run db:use:sqlite
# অথবা সুইচ করে সরাসরি Fresh DB তৈরি ও সিড করতে:
npm run db:fresh:sqlite
```

### ৩. Docker PostgreSQL-এ সুইচ করা
```bash
# Docker চালু রাখুন (docker compose up -d)
npm run db:use:postgres
# অথবা সুইচ করে সরাসরি Fresh DB তৈরি ও সিড করতে:
npm run db:fresh:postgres
```

### ৪. বর্তমান অ্যাক্টিভ ডাটাবেজে Fresh Migration / Reset চালানো
```bash
npm run db:fresh
```

> **নোট:** ডাটাবেজ সুইচ করার পর আপনার টার্মিনালে `npm run dev` রিস্টার্ট করুন (Ctrl+C চেপে আবার `npm run dev`), যেন Next.js নতুন ডাটাবেজ কানেকশন লোড করতে পারে।

