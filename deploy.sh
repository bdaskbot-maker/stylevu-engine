#!/bin/bash
# ============================================
# StyleVu - Brand Deployment Script
# Usage: ./deploy.sh <brand-id> [platform]
# Platforms: vercel (default), cloudflare
# ============================================

set -e

BRAND_ID="${1:-demo}"
PLATFORM="${2:-cloudflare}"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo "  StyleVu - Deploying Brand: $BRAND_ID"
echo "  Platform: $PLATFORM"
echo "============================================"

# Check brand config exists
CONFIG_PATH="$PROJECT_DIR/src/brands/$BRAND_ID/config.json"
if [ ! -f "$CONFIG_PATH" ]; then
  echo "❌ Error: Brand config not found at $CONFIG_PATH"
  echo ""
  echo "To create a new brand:"
  echo "  1. mkdir -p src/brands/$BRAND_ID"
  echo "  2. Copy src/brands/demo/config.json to src/brands/$BRAND_ID/config.json"
  echo "  3. Edit the config with brand details"
  echo "  4. Run this script again"
  exit 1
fi

# Validate config JSON
if ! python3 -c "import json; json.load(open('$CONFIG_PATH'))" 2>/dev/null; then
  if ! node -e "require('$CONFIG_PATH')" 2>/dev/null; then
    echo "❌ Error: Invalid JSON in config.json"
    exit 1
  fi
fi

echo "✅ Brand config validated"

# Install dependencies if needed
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "📦 Installing dependencies..."
  cd "$PROJECT_DIR"
  npm install
fi

# Build with brand-specific env
echo "🔨 Building app for $BRAND_ID..."
cd "$PROJECT_DIR"
VITE_BRAND_ID="$BRAND_ID" \
VITE_PROXY_URL="${PROXY_URL:-https://gemini-proxy.stylevu.com}" \
VITE_IMAGE_BASE_URL="${IMAGE_BASE_URL:-https://images.stylevu.com}" \
npm run build

echo "✅ Build complete"

# Deploy based on platform
case "$PLATFORM" in
  "vercel")
    echo "🚀 Deploying to Vercel..."
    if ! command -v vercel &>/dev/null; then
      echo "Installing Vercel CLI..."
      npm install -g vercel
    fi
    vercel deploy --prod --yes \
      --name "stylevu-$BRAND_ID" \
      --build-env VITE_BRAND_ID="$BRAND_ID"
    echo ""
    echo "✅ Deployed to Vercel!"
    echo "🔗 URL: https://stylevu-$BRAND_ID.vercel.app"
    ;;

  "cloudflare")
    echo "🚀 Deploying to Cloudflare Pages..."
    if ! command -v wrangler &>/dev/null; then
      echo "Installing Wrangler CLI..."
      npm install -g wrangler
    fi
    wrangler pages deploy dist \
      --project-name="stylevu-$BRAND_ID" \
      --branch="main"
    echo ""
    echo "✅ Deployed to Cloudflare Pages!"
    echo "🔗 URL: https://stylevu-$BRAND_ID.pages.dev"
    ;;

  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Supported: vercel, cloudflare"
    exit 1
    ;;
esac

echo ""
echo "============================================"
echo "  ✨ Brand $BRAND_ID deployed successfully!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Test the app at the URL above"
echo "  2. Set up custom domain (Growth/Premium):"
echo "     - Brand adds CNAME: tryon.brand.com → stylevu-$BRAND_ID.pages.dev"
echo "     - Configure in Cloudflare Pages → Custom Domains"
echo "  3. Upload product images to R2:"
echo "     wrangler r2 object put stylevu-products/$BRAND_ID/products/item.png --file=./path/to/image.png"
echo ""
