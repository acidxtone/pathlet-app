'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Pathlet</h1>
        <p className="mb-6">Your journey of self-discovery begins here</p>
        <Link 
          href="/auth" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
