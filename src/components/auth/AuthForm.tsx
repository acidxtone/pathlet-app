import React, { useState } from 'react';
import { signUp, signIn, sendMagicLink, signInWithGoogle } from '@/lib/auth';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'magiclink'>('signin');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      switch (authMode) {
        case 'signup':
          await signUp(email, password);
          break;
        case 'signin':
          await signIn(email, password);
          break;
        case 'magiclink':
          await sendMagicLink(email);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-6 text-center">
        {authMode === 'signup' ? 'Sign Up' : 
         authMode === 'signin' ? 'Sign In' : 
         'Magic Link Login'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {authMode !== 'magiclink' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={authMode !== 'magiclink'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {authMode === 'signup' ? 'Sign Up' : 
             authMode === 'signin' ? 'Sign In' : 
             'Send Magic Link'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Sign in with Google
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        {authMode === 'signup' ? (
          <p>
            Already have an account?{' '}
            <button 
              onClick={() => setAuthMode('signin')} 
              className="text-blue-500 hover:underline"
            >
              Sign In
            </button>
          </p>
        ) : authMode === 'signin' ? (
          <div className="space-y-2">
            <p>
              <button 
                onClick={() => setAuthMode('magiclink')} 
                className="text-blue-500 hover:underline"
              >
                Login with Magic Link
              </button>
            </p>
            <p>
              Don't have an account?{' '}
              <button 
                onClick={() => setAuthMode('signup')} 
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        ) : (
          <p>
            Prefer password?{' '}
            <button 
              onClick={() => setAuthMode('signin')} 
              className="text-blue-500 hover:underline"
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
