# 🔥 Firestore Setup Instructions

## ⚠️ IMPORTANT: You MUST do this before adding products!

The error "Missing or insufficient permissions" means Firestore is either:
1. Not enabled yet, OR
2. Has restrictive security rules

## Step-by-Step Setup

### 1. Enable Firestore Database

1. Go to: https://console.firebase.google.com/
2. Select your project: **the-plush-stories**
3. In the left sidebar, click **Build** → **Firestore Database**
4. Click the **Create Database** button
5. Choose **Start in test mode** (important!)
6. Select location: **asia-south1** (Mumbai - closest to India)
7. Click **Enable**

Wait 1-2 minutes for Firestore to be provisioned.

### 2. Update Security Rules

After Firestore is enabled:

1. In Firestore Database, click the **Rules** tab at the top
2. You'll see default rules. Replace them with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read products, categories, and settings
    match /products/{productId} {
      allow read: if true;
      allow write: if true; // Temporary - allows admin panel to write
    }
    
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if true; // Temporary - allows admin panel to write
    }
    
    match /settings/{settingId} {
      allow read: if true;
      allow write: if true; // Temporary - allows admin panel to write
    }
  }
}
```

3. Click **Publish** button

**Note**: These rules allow anyone to read/write. This is fine for development. Before going live, you should implement proper authentication.

### 3. Test the Admin Panel

1. Refresh your browser at: http://localhost:3000/admin
2. Login with username: `yug`, password: `sakshi`
3. Try adding a category first:
   - Click **Categories** tab
   - Click **+ Add Category**
   - Name: "Bunny Collection"
   - Order: 1
   - Click **Add Category**

4. Then add a product:
   - Click **Products** tab
   - Click **+ Add Product**
   - Fill in all details
   - Upload images (they'll go to Cloudinary)
   - Click **Add Product**

### 4. Verify in Firebase Console

After adding products:

1. Go back to Firebase Console → Firestore Database
2. Click the **Data** tab
3. You should see collections: `products`, `categories`
4. Click on them to see your data!

## 🐛 Troubleshooting

### Still getting "Missing or insufficient permissions"?
- Make sure you clicked **Publish** after updating the rules
- Wait 30 seconds and try again
- Clear your browser cache and reload

### "Unsupported field value: undefined" error?
- This is now fixed in the code
- Refresh your browser to get the latest code

### Images not uploading?
- Check that your Cloudinary preset "the-plush-stories" is set to **Unsigned**
- Go to: https://console.cloudinary.com/
- Settings → Upload → Upload presets
- Find "the-plush-stories" and make sure Signing Mode is "Unsigned"

### Products not showing on website?
- Make sure you added at least one category first
- Assign products to that category
- Check that you marked some as "Bestseller" or "Featured"

## ✅ What Happens After Setup

Once Firestore is enabled and rules are set:

1. ✅ Admin panel can add/edit/delete products
2. ✅ Images upload to Cloudinary automatically
3. ✅ Product data saves to Firestore
4. ✅ Website displays products from Firestore
5. ✅ Everything works in real-time!

## 🔒 Security Note

The current rules (`allow write: if true`) are for development only. Before deploying to production:

1. Set up Firebase Authentication
2. Update rules to check for authenticated admin users
3. Use Firebase Admin SDK on backend for admin operations

For now, the hardcoded username/password in the admin panel is fine for testing.

---

**After completing these steps, try adding a product again!** 🚀
