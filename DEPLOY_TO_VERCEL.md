# 🚀 Deploy to Vercel

## Quick Deploy Steps

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? **the-plush-stories** (or press Enter for default)
- In which directory is your code? **./** (press Enter)
- Want to modify settings? **N**

4. **Add Environment Variables**:
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```
Paste: `AIzaSyBxK9ZzjL6cobwx_KYhdFqunzsDCIE1jKw`

Repeat for each variable:
```bash
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# Paste: the-plush-stories.firebaseapp.com

vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
# Paste: the-plush-stories

vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
# Paste: the-plush-stories.firebasestorage.app

vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
# Paste: 449093100761

vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
# Paste: 1:449093100761:web:90d08355593582ced90ac8
```

5. **Deploy to Production**:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard (Easier)

1. **Push to GitHub** (if not already):
```bash
git init
git add .
git commit -m "Initial commit - The Plush Stories website"
git branch -M main
```

Create a new repository on GitHub, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/the-plush-stories.git
git push -u origin main
```

2. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/
   - Click **Add New** → **Project**
   - Click **Import Git Repository**
   - Select your GitHub repository

3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**:
   Click **Environment Variables** and add:
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBxK9ZzjL6cobwx_KYhdFqunzsDCIE1jKw` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `the-plush-stories.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `the-plush-stories` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `the-plush-stories.firebasestorage.app` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `449093100761` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:449093100761:web:90d08355593582ced90ac8` |

5. **Click Deploy**!

## After Deployment

You'll get a URL like: `https://the-plush-stories.vercel.app`

### Test Your Live Site

1. Visit your Vercel URL
2. Go to `/admin` and login (username: `yug`, password: `sakshi`)
3. Add products - they should work exactly like localhost!

### Custom Domain (Optional)

If you have a domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `theplushstories.com`)
3. Follow Vercel's DNS instructions
4. Wait for DNS propagation (5-30 minutes)

## 🔧 Troubleshooting

### Build fails on Vercel?
- Check the build logs in Vercel dashboard
- Make sure all environment variables are added
- Try running `npm run build` locally first

### Environment variables not working?
- Make sure they're added to **Production** environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Admin panel not working?
- Check browser console for errors
- Verify Firebase rules are set correctly
- Make sure Firestore is enabled

### Images not uploading?
- Verify Cloudinary preset is "Unsigned"
- Check browser network tab for failed requests

## 📱 Share with Your Friend

Once deployed, share:
- **Website**: `https://your-site.vercel.app`
- **Admin Panel**: `https://your-site.vercel.app/admin`
- **Login**: username `yug`, password `sakshi`

## 🔄 Future Updates

To update the live site:

**If using CLI:**
```bash
vercel --prod
```

**If using GitHub:**
- Just push to main branch
- Vercel auto-deploys!

```bash
git add .
git commit -m "Update products"
git push
```

---

**Ready to deploy? Let's go! 🚀**
