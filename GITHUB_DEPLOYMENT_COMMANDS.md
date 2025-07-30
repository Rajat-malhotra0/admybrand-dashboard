# GitHub + Netlify Deployment Commands

## Step 1: Push to GitHub

After creating your GitHub repository, run these commands:

```bash
# Add your GitHub repository as remote (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename the main branch to 'main' (GitHub's default)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up or log in (you can use your GitHub account)
3. Click "New site from Git"
4. Choose "GitHub" as your Git provider
5. Authorize Netlify to access your GitHub account
6. Select your repository from the list
7. Configure deployment settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build` (already configured in netlify.toml)
   - **Publish directory**: `out` (already configured in netlify.toml)
8. Click "Deploy site"

## Step 3: Wait for Build and Go Live

- Netlify will automatically start building your site
- The build process takes 2-5 minutes
- Once complete, you'll get a live URL like: `https://wonderful-name-123456.netlify.app`
- Your site will automatically redeploy whenever you push changes to GitHub

## Step 4: Custom Domain (Optional)

To use your own domain:
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow the DNS configuration instructions

## Automatic Deployments

✅ Every time you push to GitHub, Netlify will automatically:
- Pull the latest code
- Run `npm run build`
- Deploy the new version
- Your site stays live during updates

## Your Project is Production-Ready With:

✅ **Responsive Design** - Works on all devices
✅ **Dark Mode Support** - Light/dark theme toggle
✅ **Lead Management** - Professional terminology
✅ **Analytics Dashboard** - Interactive charts
✅ **CSV Export** - Download data functionality
✅ **Performance Optimized** - Static build with caching
✅ **Security Headers** - Configured in netlify.toml
✅ **Clean UI** - No unnecessary elements

Your admin dashboard will be live and accessible worldwide!
