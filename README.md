# ROYVÉ Eyewear — Official Website

> **NOT FOR EVERYONE.**

A full luxury e-commerce website for ROYVÉ Eyewear, built with Next.js 14, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand (cart persistence via localStorage)
- **Forms**: React Hook Form + Zod
- **Email**: Resend API
- **Database**: SQLite via better-sqlite3 (local order storage)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your values:

```bash
cp .env.local .env.local
```

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key from resend.com |
| `ORDER_EMAIL` | Email address to receive order notifications |

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero, featured products, brand story |
| `/shop` | Product grid with category filters |
| `/shop/[id]` | Product detail page |
| `/cart` | Shopping cart with quantity controls |
| `/checkout` | Order form with Stripe placeholder |
| `/success` | Order confirmation with animated checkmark |

## Products

Products are defined in `lib/products.ts`:

| Name | Category | Price |
|---|---|---|
| NOIR | Classic | 129 лв. |
| AMBER | Classic | 139 лв. |
| AZURE | Rimless | 159 лв. |
| OBSIDIAN | Classic | 119 лв. |

## Features

- 🌑 Dark luxury aesthetic (black + gold)
- 🌐 Bilingual UI (Bulgarian / English) with language switcher
- 🎬 Framer Motion animations throughout
- ✨ Custom gold cursor
- 🎨 Loading screen with brand reveal
- 📦 Cart state persisted in localStorage
- 📋 Orders saved to local SQLite database
- 📧 Order email notifications via Resend
- 📱 Fully responsive (mobile-first)

## Brand Colors

| Color | Hex |
|---|---|
| Background | `#0a0a0a` |
| Gold | `#c9a84c` |
| Gold Light | `#e8c96a` |
| White | `#ffffff` |

## License

© ROYVÉ Eyewear. All rights reserved.
