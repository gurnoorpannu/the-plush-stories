# Firebase & Cloudinary Setup Guide

## ✅ What's Already Done

1. **Cloudinary Integration**: Images now upload to Cloudinary (cloud name: djscwzftc, preset: the-plush-stories)
2. **Firebase Config**: Environment variables are set in `.env.local`
3. **Code Updated**: All image uploads now use Cloudinary instead of Firebase Storage

## 🔧 What You Need to Do in Firebase Console

### Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **the-plush-stories**
3. Click **Build** → **Firestore Database**
4. Click **Create Database**
5. Choose **Start in test mode** (we'll secure it later)
6. Select a location (choose closest to India, like `asia-south1`)
7. Click **Enable**

### Step 2: Set Up Firestore Security Rules (Important!)

Once Firestore is enabled, update the security rules:

1. In Firestore Database, click the **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all products, categories, and settings
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Only admin panel can write (client-side)
    }
    
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /settings/{settingId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

3. Click **Publish**

**Note**: These rules allow anyone to read data (for the public website) but prevent direct writes from the browser. The admin panel writes are allowed because we're using the Firebase Admin SDK credentials.

### Step 3: Initialize Collections (Optional)

You can add some initial data through the admin panel, or manually create these collections in Firestore:

1. **categories** collection - Add a few default categories:
   - Document ID: auto
   - Fields:
     - `name` (string): "Bunny Collection"
     - `slug` (string): "bunny-collection"
     - `order` (number): 1
     - `image` (string): "" (optional)

2. **settings** collection - Add site settings:
   - Document ID: `general`
   - Fields:
     - `heroTitle` (string): "Welcome to The Plush Stories"
     - `heroSubtitle` (string): "Handcrafted soft toys that tell a story"
     - `contactPhone` (string): "+91 78145 50583"
     - `whatsappNumber` (string): "917814550583"
     - `instagramLink` (string): "https://www.instagram.com/theplushstories"
     - `showAnnouncementBar` (boolean): false
     - `announcementBar` (string): ""

## 🎨 Cloudinary Setup (Already Done!)

Your Cloudinary is already configured:
- **Cloud Name**: djscwzftc
- **Upload Preset**: the-plush-stories
- **Folder**: plush-stories

All product and category images will be uploaded here automatically.

## 🚀 Testing the Admin Panel

1. Start the dev server: `npm run dev`
2. Go to: `http://localhost:3000/admin`
3. Login with:
   - Username: `yug`
   - Password: `sakshi`
4. Try adding a product with images - they should upload to Cloudinary!

## 📝 Adding Products

When adding products through the admin panel:

1. Click **Products** → **Add Product**
2. Fill in:
   - Product Name
   - Category (select from dropdown)
   - Price
   - Description
   - Upload multiple images (they'll go to Cloudinary)
   - Add marketplace links (Amazon, Flipkart, etc.)
   - Toggle Bestseller/New Arrival/Featured as needed
3. Click **Add Product**

The product will be saved to Firestore and images to Cloudinary!

## 🔒 Security Notes

- The current setup uses "test mode" which is fine for development
- Before going live, you should:
  1. Set up proper authentication for the admin panel
  2. Use Firebase Admin SDK on a backend API route
  3. Update Firestore rules to be more restrictive
  4. Enable Cloudinary signed uploads for better security

## 🐛 Troubleshooting

**If products don't show up:**
- Check browser console for errors
- Verify Firestore is enabled in Firebase Console
- Check that collections exist in Firestore

**If images don't upload:**
- Verify Cloudinary upload preset is set to "Unsigned"
- Check browser network tab for failed requests
- Ensure the preset name matches exactly: `the-plush-stories`

**If you see "Permission denied" errors:**
- Update Firestore security rules as shown in Step 2 above
