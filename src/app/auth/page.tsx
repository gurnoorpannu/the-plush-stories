'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

const C = {
  bg: '#FAF7F2',
  primary: '#C4916E',
  secondary: '#8B7355',
  accent: '#E8B4A0',
  dark: '#2D2D2D',
  subtle: '#F0EBE3',
} as const;

export default function AuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully!');
      }
      router.push('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(isSignup ? 'Signup failed. Please try again.' : 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: C.bg }}>
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8" style={{ background: '#fff' }}>
        <div className="text-center mb-8">
          <Link href="/">
            <h1
              className="text-2xl font-bold mb-1 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: C.dark, fontFamily: 'var(--font-playfair-var), serif' }}
            >
              The Plush Stories<span style={{ color: C.primary }}>™</span>
            </h1>
          </Link>
          <p className="text-sm" style={{ color: C.secondary }}>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: C.dark }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-shadow focus:ring-2"
              style={{
                borderColor: C.subtle,
                background: C.bg,
                color: C.dark,
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: C.dark }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-shadow focus:ring-2"
              style={{
                borderColor: C.subtle,
                background: C.bg,
                color: C.dark,
              }}
              required
            />
            {isSignup && (
              <p className="text-xs mt-1" style={{ color: C.secondary }}>
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: C.primary }}
          >
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: C.secondary }}
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: C.secondary }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
