# ✅ The Plush Stories - Ready to Add Products!

## 🎉 What's Complete

### ✅ Cloudinary Integration
- **Cloud Name**: djscwzftc
- **Preset**: the-plush-stories
- All image uploads now go directly to Cloudinary
- No Firebase Storage needed!

### ✅ Firebase Firestore
- Connected to your Firebase project: `the-plush-stories`
- Database for storing products, categories, and settings

### ✅ Admin Panel
- Login: `http://localhost:3000/admin`
- Username: `yug`
- Password: `sakshi`

## 🚀 Next Steps (Do This Now!)

### 1. Enable Firestore in Firebase Console

**IMPORTANT**: You need to do this before adding products!

1. Go to: https://console.firebase.google.com/
2. Select project: **the-plush-stories**
3. Click **Build** → **Firestore Database**
4. Click **Create Database**
5. Choose **Start in test mode**
6. Select location: **asia-south1** (closest to India)
7. Click **Enable**

### 2. Test Adding a Product

Once Firestore is enabled:

1. Go to: `http://localhost:3000/admin`
2. Login with username: `yug`, password: `sakshi`
3. Click **Categories** tab first
4. Add a category (e.g., "Bunny Collection")
5. Click **Products** tab
6. Click **+ Add Product**
7. Fill in the details:
   - Name: "Choco Bunny"
   - Category: Select the one you just created
   - Price: 599
   - Description: "Adorable chocolate brown bunny soft toy"
   - Upload images (they'll go to Cloudinary!)
   - Add Amazon/Flipkart links
   - Toggle "Bestseller" if needed
8. Click **Add Product**

### 3. View on Website

After adding products, check:
- Homepage: `http://localhost:3000/` (should show in bestsellers/categories)
- Products page: `http://localhost:3000/products`
- Individual product: Click on any product card

## 📱 Admin Panel Features

### Products Tab
- Add/Edit/Delete products
- Upload multiple images per product
- Set price and original price (for showing discounts)
- Add marketplace links (Amazon, Flipkart, Meesho, Other)
- Mark as Bestseller/New Arrival/Featured
- Assign to categories

### Categories Tab
- Create product categories
- Add category images
- Set display order
- Auto-generates URL-friendly slugs

### Settings Tab
- Update hero title and subtitle
- Configure announcement bar
- Set contact details (phone, email, WhatsApp)
- Update Instagram link

### Quick Links Tab
- Dashboard with stats
- Quick access to all marketplace links

## 🎨 How Image Upload Works

1. You select images in the admin panel
2. Images are uploaded to Cloudinary (djscwzftc account)
3. Cloudinary returns secure URLs
4. URLs are saved in Firestore with the product data
5. Website displays images from Cloudinary CDN (super fast!)

## 🔍 Troubleshooting

### "Permission denied" error when adding products
→ Make sure you enabled Firestore in test mode (Step 1 above)

### Images not uploading
→ Check that your Cloudinary preset "the-plush-stories" is set to **Unsigned** mode

### Products not showing on website
→ Make sure you added at least one category first, then assigned products to it

### Can't login to admin
→ Double-check username is `yug` and password is `sakshi` (case-sensitive)

## 📞 Contact Info Already Set

The website already has:
- WhatsApp: +91 78145 50583
- Instagram: @theplushstories

You can update these in the **Settings** tab of the admin panel.

## 🌐 When Ready to Deploy

Once you've added products and tested everything:

1. I can help you deploy to Vercel (free hosting)
2. You'll get a live URL like: `theplushstories.vercel.app`
3. You can then connect your own domain if you have one

---

**Current Status**: Dev server running at `http://localhost:3000`

**Next Action**: Enable Firestore Database in Firebase Console, then start adding products! 🎉
