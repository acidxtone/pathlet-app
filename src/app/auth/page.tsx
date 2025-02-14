'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, signIn, sendMagicLink, signInWithProvider } from '@/lib/auth';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magiclink'>('signin');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      switch (authMode) {
        case 'signup':
          await signUp(email, password);
          router.push('/dashboard');
          break;
        case 'signin':
          await signIn(email, password);
          router.push('/dashboard');
          break;
        case 'magiclink':
          await sendMagicLink(email);
          alert('Magic link sent! Check your email.');
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'apple') => {
    try {
      await signInWithProvider(provider);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {authMode === 'signin' ? 'Sign in to your account' : 
             authMode === 'signup' ? 'Create a new account' : 
             'Login with Magic Link'}
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            {authMode !== 'magiclink' && (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required={authMode !== 'magiclink'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {authMode === 'signin' ? 'Sign In' : 
               authMode === 'signup' ? 'Sign Up' : 
               'Send Magic Link'}
            </button>
          </div>
        </form>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Sign in with Google
          </button>
          
          <div className="text-center">
            {authMode === 'signin' ? (
              <>
                <button 
                  onClick={() => setAuthMode('magiclink')}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Login with Magic Link
                </button>
                <p className="mt-2">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setAuthMode('signup')}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Sign Up
                  </button>
                </p>
              </>
            ) : authMode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => setAuthMode('signin')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Prefer password login?{' '}
                <button 
                  onClick={() => setAuthMode('signin')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
