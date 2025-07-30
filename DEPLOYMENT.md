# ADmyBRAND Insights - Netlify Deployment Guide

This guide will help you deploy your social media analytics dashboard to Netlify.

## 🚀 Quick Deployment

### Method 1: Deploy from Git Repository (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your Git provider and repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `out`
     - **Node.js version**: `18`

3. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Method 2: Manual Deployment

1. **Build the project locally**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Drag and drop the `out` folder to the deployment area

## 🔧 Configuration Files

### netlify.toml
The `netlify.toml` file is already configured with:
- Build settings
- Redirects for SPA routing
- Security headers
- Caching rules
- Development settings

### next.config.js
The Next.js configuration includes:
- Static export output
- Image optimization disabled (required for static sites)
- ESLint build bypass

## 🌐 Environment Variables

Since this is a static site, all environment variables must be set at build time:

### In Netlify Dashboard:
1. Go to Site settings → Environment variables
2. Add any required environment variables:
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_APP_ENV=production
   ```

### Local Development:
Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_ENV=development
```

## 📁 Project Structure

```
project/
├── app/                    # Next.js 13+ app directory
├── components/            # React components
├── utils/                # Utility functions
├── backend/              # Backend files (not deployed)
├── public/               # Static assets
├── out/                  # Generated static files (after build)
├── netlify.toml          # Netlify configuration
├── next.config.js        # Next.js configuration
└── package.json          # Dependencies and scripts
```

## 🚦 Build Process

1. **Install dependencies**: `npm install`
2. **Run linting**: `npm run lint` (optional)
3. **Build the app**: `npm run build`
4. **Generate static files**: Files are output to `out/` directory
5. **Deploy**: Upload `out/` directory contents

## 🔍 Troubleshooting

### Common Issues:

1. **Build Errors**
   - Check Node.js version (use 18+)
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **Routing Issues**
   - Verify `netlify.toml` redirects are configured
   - Check Next.js static export configuration

3. **Asset Loading Issues**
   - Ensure `images: { unoptimized: true }` in `next.config.js`
   - Check asset paths are relative

4. **API Issues**
   - Remember: This is a static site, backend API won't be deployed
   - Use external APIs or serverless functions
   - Set CORS headers on your APIs

## 📊 Performance Optimization

The configuration includes:
- Static asset caching (1 year)
- Security headers
- Gzip compression (automatic with Netlify)
- Image optimization disabled for compatibility

## 🔒 Security

Security headers are configured in `netlify.toml`:
- XSS Protection
- Content Type Options
- Frame Options
- Referrer Policy
- Permissions Policy

## 🎯 Post-Deployment

After successful deployment:

1. **Custom Domain** (optional)
   - Go to Site settings → Domain management
   - Add your custom domain

2. **HTTPS** (automatic)
   - Netlify provides free SSL certificates

3. **Performance Monitoring**
   - Monitor site performance in Netlify dashboard
   - Use Lighthouse for performance audits

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify all configuration files
3. Test build locally first
4. Check Netlify documentation

---

## 🎉 Your dashboard will be live at:
`https://your-site-name.netlify.app`

Happy deploying! 🚀
