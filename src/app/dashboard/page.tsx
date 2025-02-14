'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { getCurrentUser, signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<{
    id: string;
    email: string | null;
    emailVerified: boolean;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        router.replace('/auth');
      }
    };

    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-3xl font-extrabold text-center text-gray-900">Dashboard</h2>
                  <p className="text-center">Welcome to your personal dashboard!</p>
                  
                  <div className="space-y-2">
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p>
                      <strong>Email Verified:</strong>{' '}
                      {user.emailVerified ? '✅ Verified' : '❌ Not Verified'}
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
