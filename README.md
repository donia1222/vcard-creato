# VCard Creator

Create your digital business card in seconds. Fill out a form, get a permanent URL and a QR code ready to share or print.

## Features

- Live preview while filling out the form
- Permanent public URL for each card
- Auto-generated QR code
- Download contact as `.vcf` (compatible with iOS, Android and any contacts app)
- Profile photo embedded in the `.vcf`
- PHP + MySQL backend — no external dependencies
- Responsive design, light mode

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** PHP 8 + MySQL
- **QR Code:** [qrcode](https://www.npmjs.com/package/qrcode)
- **Deploy:** Vercel (frontend) + shared PHP hosting (backend)

## Demo

[vcard-creato.vercel.app](https://vcard-creato.vercel.app)

## Project Structure

```
vcard-creator/
├── app/
│   ├── page.tsx            # Main form
│   ├── card/[id]/page.tsx  # Public card view
│   └── layout.tsx
├── components/
│   ├── CardPreview.tsx     # Live card preview
│   └── QRDisplay.tsx       # QR code generator (canvas)
├── php-api/
│   ├── config.php          # DB credentials (not public)
│   ├── cards.php           # Main REST API
│   ├── db_init.php         # Creates the table (run once)
│   ├── vcards.sql          # SQL schema
│   └── .htaccess           # Protects config.php
├── types/
│   └── card.ts
└── lib/
    └── vcf.ts
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tu-usuario/vcard-creator.git
cd vcard-creator
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=      # URL of your cards.php
NEXT_PUBLIC_BASE_URL=     # Public URL of this app
```

### 3. Set up the PHP backend

1. Upload the files inside `php-api/` to your hosting
2. Edit `config.php` with your MySQL credentials
3. Import `vcards.sql` into your database
4. Open `db_init.php` in the browser to verify the connection
5. Block `db_init.php` in `.htaccess` once verified

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

## PHP API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `cards.php` | Create a card → returns `{ id, url, card }` |
| `GET` | `cards.php?id=xxx` | Get card data as JSON |
| `GET` | `cards.php?id=xxx&action=vcf` | Download `.vcf` file |

## Deploy to Vercel

1. Connect the repository at [vercel.com](https://vercel.com)
2. Add environment variables under **Settings → Environment Variables**
3. Deploy

## License

MIT — [Lweb.ch](https://lweb.ch)
