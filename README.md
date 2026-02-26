# StyleVu Engine 🚀

**White-label AI Virtual Try-On Platform for Fashion Brands**

One codebase → deploy unique try-on apps for unlimited brands. Each brand gets their own colors, logo, products, and domain.

## Architecture

```
stylevu-engine/
├── src/
│   ├── App.tsx                    # Main app (reads brandConfig)
│   ├── BrandContext.tsx            # React context for brand config
│   ├── brandConfig.ts             # Config loader + theme applicator
│   ├── i18n.ts                    # Bengali/English translations
│   ├── types.ts                   # TypeScript types
│   ├── main.tsx                   # Entry point
│   ├── styles.css                 # Mobile-first CSS (CSS vars for theming)
│   ├── vite-env.d.ts              # Vite env types
│   ├── components/
│   │   ├── Header.tsx             # Brand logo + name + language toggle
│   │   ├── Footer.tsx             # Powered by badge + WhatsApp support
│   │   ├── StartScreen.tsx        # Welcome + photo options
│   │   ├── CameraView.tsx         # Camera capture (front/back)
│   │   ├── WardrobePanel.tsx      # Product catalog + categories + search
│   │   ├── ResultScreen.tsx       # Try-on result display
│   │   ├── ProcessingOverlay.tsx  # Loading animation during AI gen
│   │   ├── SharePanel.tsx         # Facebook/WhatsApp/Instagram sharing
│   │   └── BuyButton.tsx          # Configurable purchase (website/WhatsApp/FB)
│   ├── services/
│   │   └── geminiService.ts       # AI proxy calls + usage checking
│   ├── hooks/
│   │   └── useAppState.ts         # Central state management
│   ├── utils/
│   │   └── watermark.ts           # Brand watermark overlay
│   └── brands/
│       └── demo/config.json       # Example brand config
├── proxy/
│   ├── worker.js                  # Cloudflare Worker (AI proxy + rate limiting)
│   └── wrangler.toml              # Worker deployment config
├── deploy.sh                      # One-command brand deployment
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html                     # PWA-ready HTML with Bengali font
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
# Default (demo brand)
npm run dev

# Specific brand
VITE_BRAND_ID=aarong npm run dev
```

### 3. Deploy AI Proxy (One-time)

```bash
cd proxy

# Login to Cloudflare
wrangler login

# Create KV namespaces
wrangler kv namespace create "BRAND_USAGE"
wrangler kv namespace create "BRAND_CONFIG"
# → Copy the IDs into wrangler.toml

# Set Gemini API key
wrangler secret put GEMINI_API_KEY
# → Paste your Google AI Studio API key

# Deploy
wrangler deploy
# → Live at: https://stylevu-proxy.YOUR-SUBDOMAIN.workers.dev
```

### 4. Deploy a Brand App

```bash
# Using Cloudflare Pages (recommended)
./deploy.sh aarong cloudflare

# Using Vercel
./deploy.sh aarong vercel
```

## Onboarding a New Brand

### Step 1: Create Brand Config

```bash
mkdir -p src/brands/aarong
cp src/brands/demo/config.json src/brands/aarong/config.json
```

### Step 2: Edit Config

Edit `src/brands/aarong/config.json`:

```json
{
  "brandId": "aarong",
  "brandName": "Aarong",
  "brandNameBn": "আড়ং",
  "logo": "https://images.stylevu.com/aarong/logo.png",
  "tagline": "Handcrafted Fashion, AI Try-On",
  "taglineBn": "হাতে তৈরি ফ্যাশন, AI ট্রাই-অন",
  "colors": {
    "primary": "#c41e3a",
    "secondary": "#8b0000",
    "background": "#ffffff",
    "text": "#1f2937",
    "accent": "#d4941a"
  },
  "language": "bn",
  "contactWhatsApp": "+8801XXXXXXXXX",
  "buyLinkType": "whatsapp",
  "products": [
    {
      "id": "panjabi-01",
      "name": "Classic Cotton Panjabi",
      "nameBn": "ক্লাসিক কটন পাঞ্জাবি",
      "category": "panjabi",
      "price": 3500,
      "currency": "৳",
      "imageUrl": "https://images.stylevu.com/aarong/products/panjabi-01.png",
      "buyLink": "",
      "isActive": true,
      "sortOrder": 1
    }
  ],
  "plan": "growth",
  "maxTryOns": 1500
}
```

### Step 3: Upload Product Images to R2

```bash
# Create R2 bucket (one-time)
wrangler r2 bucket create stylevu-products

# Upload brand images
for img in brands/aarong/products/*.png; do
  wrangler r2 object put "stylevu-products/aarong/products/$(basename $img)" --file="$img"
done

# Upload logo
wrangler r2 object put "stylevu-products/aarong/logo.png" --file="brands/aarong/logo.png"
```

### Step 4: Deploy

```bash
./deploy.sh aarong cloudflare
```

### Step 5: Custom Domain (Growth/Premium plans)

1. Brand adds DNS: `tryon.aarong.com → CNAME → stylevu-aarong.pages.dev`
2. In Cloudflare Pages → Custom Domains → Add `tryon.aarong.com`
3. SSL auto-provisioned

## Product Image Requirements

| Spec | Requirement |
|------|------------|
| Format | PNG (transparent bg preferred) or JPG (white bg) |
| Size | Min 1000x1000px, recommended 1500x2000px |
| Max file | 5MB |
| Background | White or transparent |
| Content | Single garment, full view, no model |
| Orientation | Portrait (taller than wide) |

## Plan Limits

| Plan | Monthly Try-Ons | Powered By Badge | Custom Domain |
|------|----------------|-------------------|---------------|
| Starter (৳1,499/mo) | 300 | Yes | No |
| Growth (৳4,999/mo) | 1,500 | Yes | Yes |
| Premium (৳14,999/mo) | 5,000 | No | Yes |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BRAND_ID` | Brand folder name | `demo` |
| `VITE_PROXY_URL` | AI proxy Worker URL | `https://gemini-proxy.stylevu.com` |
| `VITE_IMAGE_BASE_URL` | R2 images URL | `https://images.stylevu.com` |

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI**: Gemini 2.0 Flash (via Cloudflare Worker proxy)
- **Hosting**: Cloudflare Pages (brand apps) / Vercel (alternative)
- **CDN + Storage**: Cloudflare R2 (product images)
- **Rate Limiting**: Cloudflare KV (per-brand usage counters)
- **Languages**: Bengali + English (i18n system)

## Key Features

- 🎨 **Full brand customization** - colors, logo, language, products
- 📱 **Mobile-first PWA** - works on any phone browser
- 🤖 **AI virtual try-on** - Gemini Flash generates realistic results
- 📤 **Social sharing** - Facebook, WhatsApp, Instagram, Download
- 🛒 **Flexible buy flow** - Website, WhatsApp order, Facebook
- 🌐 **Bengali + English** - full i18n with Bengali digit support
- ⚡ **One-command deploy** - `./deploy.sh brandname` → live in 5 min
- 📊 **Per-brand tracking** - usage, rate limits, analytics
- 💰 **Watermarking** - auto brand watermark on shared images (except Premium)

---

Built with ❤️ by [StartBD](https://startbd.com) | [StyleVu](https://stylevu.com)
