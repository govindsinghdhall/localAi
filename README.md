# Local AI

AI-powered Google review collection for businesses. Customers select a star rating, get AI-generated review suggestions, edit their review, and are redirected to post on Google.

> **Note:** Google does not allow posting reviews via API. This app saves drafts locally and opens the official Google review page for the customer to paste and submit.

## Tech Stack

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- ShadCN-style UI components
- Local JSON storage (`/data`)

## Quick Start

```bash
cd reviewboost-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo business

- **Roopya** — [http://localhost:3000/business/roopya](http://localhost:3000/business/roopya)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/business/[slug]` | Review collection page |
| `/dashboard` | Analytics dashboard |
| `POST /api/reviews` | Save review draft |
| `POST /api/ai-suggestions` | Generate or rewrite reviews |
| `GET /api/business/[slug]` | Get business details |

## Configuration

### Add a business

Edit `data/businesses.json`:

```json
{
  "your-slug": {
    "slug": "your-slug",
    "name": "Your Business",
    "description": "About your business",
    "category": "Your category",
    "googleReviewUrl": "https://share.google/your-link",
    "placeId": "ChIJxxxxxxxx",
    "googleWriteReviewUrl": "https://g.page/r/Cf1QSsTDGya5EBM/review"
    "logoInitials": "YB",
    "averageRating": 4.9,
    "totalReviews": 50
  }
}
```

Review page: `/business/your-slug`

### Direct Google review link (required for “Post on Google”)

Share links (`share.google/...`) do **not** open the review form. Use one of:

**Option A — Place ID (recommended)**

1. Open your business on [Google Maps](https://maps.google.com)
2. Click **Write a review**
3. Copy the URL from your browser — it looks like:
   `https://search.google.com/local/writereview?placeid=ChIJ...`
4. Put the `ChIJ...` value in `data/businesses.json` as `placeId`

**Option B — Full write-review URL**

Paste the full URL into `googleWriteReviewUrl` in `data/businesses.json`.

### OpenAI (optional)

Copy `.env.example` to `.env.local` and add your API key for smarter AI suggestions. Without it, the app uses built-in smart templates.

## Features

- ⭐ Interactive star rating & emoji sentiment
- 🤖 AI review suggestions (5 tones)
- ✍️ AI rewrite existing review
- 📋 Copy review to clipboard
- 🔗 Shareable review links & QR codes
- 📊 Analytics dashboard
- 📱 Mobile responsive dark UI

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## License

MIT
