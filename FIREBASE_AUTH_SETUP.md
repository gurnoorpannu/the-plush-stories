# 🔐 Firebase Authentication Setup

## ✅ What's Changed

The admin panel now uses **Firebase Authentication** instead of hardcoded credentials!

- Email/Password login
- Sign up functionality
- Secure authentication
- Session management

## 🔧 Firebase Console Setup

### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **the-plush-stories**
3. Click **Build** → **Authentication**
4. Click **Get Started** (if first time)
5. Click the **Sign-in method** tab
6. Click **Email/Password**
7. Toggle **Enable** to ON
8. Click **Save**

### Step 2: Create Your First Admin User

You have 2 options:

#### Option A: Sign Up via Admin Panel (Easiest)

1. Go to: `http://localhost:3000/admin`
2. Click **"Don't have an account? Sign Up"**
3. Enter your email and password (min 6 characters)
4. Click **Sign Up**
5. You're now logged in!

#### Option B: Create User in Firebase Console

1. In Firebase Console → Authentication → Users tab
2. Click **Add User**
3. Enter email: `your-email@example.com`
4. Enter password: `your-secure-password`
5. Click **Add User**
6. Now you can login with these credentials

## 🎯 How It Works

### Login Flow

1. User enters email and password
2. Firebase validates credentials
3. If valid, user is logged into admin panel
4. Session persists until logout

### Sign Up Flow

1. User clicks "Sign Up" link
2. Enters email and password (min 6 characters)
3. Firebase creates new user account
4. User is automatically logged in

### Security Features

- ✅ Passwords are hashed by Firebase (never stored in plain text)
- ✅ Email validation
- ✅ Password strength requirements (min 6 chars)
- ✅ Rate limiting on failed attempts
- ✅ Secure session management

## 📱 Using the Admin Panel

### First Time Setup

1. Go to `/admin`
2. Click **"Don't have an account? Sign Up"**
3. Create your admin account
4. Start adding products!

### Sharing with Your Friend

Tell your friend:

1. Go to: `your-site-url.vercel.app/admin`
2. Click **Sign Up**
3. Create an account with their email
4. They can now manage the website!

### Multiple Admins

You can have multiple admin users:
- Each person creates their own account
- All accounts have full admin access
- Track who made changes via Firebase Console

## 🔒 Security Best Practices

### For Development (Current Setup)

✅ Anyone can sign up for an admin account
✅ Good for testing and small teams
✅ All authenticated users have full access

### For Production (Recommended)

Before going live, you should:

1. **Disable public sign-ups**:
   - Create admin accounts manually in Firebase Console
   - Remove the "Sign Up" button from the login page

2. **Add role-based access**:
   - Use Firestore to store user roles
   - Check if user is admin before allowing access
   - Restrict certain operations to super admins

3. **Enable email verification**:
   - Require users to verify their email
   - Prevents fake accounts

4. **Add password reset**:
   - Let users reset forgotten passwords
   - Use Firebase's built-in password reset

## 🐛 Troubleshooting

### "Login failed" error
- Make sure Email/Password is enabled in Firebase Console
- Check that you're using a valid email format
- Verify password is at least 6 characters

### "Email already in use" error
- This email is already registered
- Click "Already have an account? Login" instead
- Or use a different email

### "Too many failed attempts" error
- Firebase rate limiting kicked in
- Wait a few minutes and try again
- Or reset your password

### Can't access admin panel after signup
- Check browser console for errors
- Verify Firebase Auth is enabled
- Make sure environment variables are set correctly

## 📊 Managing Users

### View All Admin Users

1. Firebase Console → Authentication → Users
2. See all registered users
3. Delete users if needed
4. Disable accounts temporarily

### Reset User Password

1. Firebase Console → Authentication → Users
2. Click the user
3. Click **Reset Password**
4. User receives email with reset link

## 🔄 Migrating from Old System

If you had the old hardcoded login (yug/sakshi):

1. Create a new account via Sign Up
2. Use any email you want
3. Old credentials no longer work
4. All existing products/data remain intact

---

**Your admin panel is now secure with Firebase Authentication! 🎉**
