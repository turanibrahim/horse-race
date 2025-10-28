# Deployment Guide

## Building for Production

### Build Command

```bash
npm run build
```

This command:
1. Runs TypeScript type checking (`vue-tsc -b`)
2. Bundles the application using Vite
3. Outputs optimized files to `dist/`

### Build Output

```
dist/
├── index.html              # Entry HTML file
└── assets/
    ├── index-[hash].js     # Bundled JavaScript
    ├── index-[hash].css    # Bundled CSS
    └── [other assets]      # Images, fonts, etc.
```

### Preview Build

Test the production build locally:

```bash
npm run preview
```

This starts a local server serving the `dist/` folder.

---

## Environment Configuration

### Development

```bash
# .env.development (optional)
VITE_APP_TITLE=Horse Racing - Development
VITE_API_URL=http://localhost:3000
```

### Production

```bash
# .env.production (optional)
VITE_APP_TITLE=Horse Racing
VITE_API_URL=https://api.example.com
```

### Accessing Environment Variables

```typescript
const appTitle = import.meta.env.VITE_APP_TITLE;
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

---

## Deployment Platforms

### Vercel

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy

```bash
vercel
```

#### 3. Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Netlify

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Deploy

```bash
netlify deploy --prod
```

#### 3. Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### GitHub Pages

#### 1. Configure Base URL

Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/horse-racing/', // Your repo name
  plugins: [vue(), tailwindcss()],
  // ... rest of config
});
```

#### 2. Add Deploy Script

Add to `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

#### 3. Install gh-pages

```bash
npm install -D gh-pages
```

#### 4. Deploy

```bash
npm run deploy
```

---

### Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caching for assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and Run

```bash
# Build image
docker build -t horse-racing .

# Run container
docker run -p 8080:80 horse-racing
```

---

### AWS S3 + CloudFront

#### 1. Build

```bash
npm run build
```

#### 2. Upload to S3

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### 3. Configure S3 Bucket

- Enable static website hosting
- Set index document: `index.html`
- Set error document: `index.html`

#### 4. CloudFront Configuration

- Origin: Your S3 bucket
- Default root object: `index.html`
- Custom error response: 404 → /index.html (200)

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test:run

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Performance Optimization

### Build Optimization

#### 1. Code Splitting

Routes are already lazy-loaded:

```typescript
{
  path: '/',
  component: () => import('@/pages/racing-dashboard.page.vue'),
}
```

#### 2. Tree Shaking

Ensure imports are specific:

```typescript
// ✅ Good
import { ref, computed } from 'vue';

// ❌ Bad
import * as Vue from 'vue';
```

#### 3. Asset Optimization

Images should be optimized before building:

```bash
# Install imagemin
npm install -D vite-plugin-imagemin

# Add to vite.config.ts
import imagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    imagemin({
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
    }),
  ],
});
```

---

### Runtime Optimization

#### 1. Compression

Enable gzip/brotli compression on your server.

**Nginx**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

#### 2. Caching Headers

Set appropriate cache headers:

```nginx
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### 3. CDN

Use a CDN for static assets:
- CloudFlare
- AWS CloudFront
- Fastly

---

## Monitoring and Analytics

### Error Tracking

#### Sentry Integration

```bash
npm install @sentry/vue
```

```typescript
// main.ts
import * as Sentry from '@sentry/vue';

Sentry.init({
  app,
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
});
```

### Analytics

#### Google Analytics

```typescript
// plugins/analytics.ts
export default {
  install(app: App) {
    if (import.meta.env.PROD) {
      // Initialize GA4
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    }
  },
};
```

---

## Health Checks

### Status Endpoint

Create a simple health check endpoint:

```typescript
// public/health.json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Access via: `https://your-domain.com/health.json`

---

## Rollback Strategy

### Version Tagging

Tag releases in Git:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Quick Rollback

If using Vercel/Netlify:
1. Go to deployments
2. Find previous successful deployment
3. Click "Promote to Production"

If using Docker:
```bash
docker pull your-registry/horse-racing:v1.0.0
docker run -p 8080:80 your-registry/horse-racing:v1.0.0
```

---

## Security Considerations

### 1. HTTPS Only

Always use HTTPS in production.

### 2. Content Security Policy

Add CSP headers:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
```

### 3. Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### 4. Environment Variables

Never commit `.env` files with sensitive data.

Use platform-specific secret management:
- Vercel: Environment Variables
- Netlify: Environment Variables
- AWS: Secrets Manager
- Docker: Docker Secrets

---

## Deployment Checklist

- [ ] Run tests: `npm run test:run`
- [ ] Run linter: `npm run lint`
- [ ] Check TypeScript: `npm run build` (includes type check)
- [ ] Test production build: `npm run preview`
- [ ] Update version in `package.json`
- [ ] Update CHANGELOG (if applicable)
- [ ] Create git tag
- [ ] Set environment variables
- [ ] Configure domain/DNS
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure CDN (optional)
- [ ] Test deployment
- [ ] Verify all routes work
- [ ] Check mobile responsiveness
- [ ] Test performance with Lighthouse

---

## Troubleshooting

### Build Fails

**Issue**: TypeScript errors during build

**Solution**: Fix type errors or update types
```bash
npm run build
# Fix reported errors
```

### Routes Don't Work After Deploy

**Issue**: 404 errors on direct URL access

**Solution**: Configure SPA fallback (see platform-specific configs above)

### Assets Not Loading

**Issue**: CSS/JS files return 404

**Solution**: Check `base` URL in `vite.config.ts`
```typescript
export default defineConfig({
  base: '/', // or '/your-repo-name/' for GitHub Pages
});
```

### Performance Issues

**Solution**: Check bundle size
```bash
npm run build
# Check dist/ folder size
```

Use bundle analyzer:
```bash
npm install -D rollup-plugin-visualizer
```
