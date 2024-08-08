"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      const response = await fetch('https://ai-assistant-caller.fly.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        alert('Login successful');
        window.location.href = '/Callerboard';
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error logging in: ' + (error instanceof Error ? error.message : 'An unknown error occurred.'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
          <div className="text-center my-4">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500" style={{backgroundColor: "rgb(37 99 235 / var(--tw-bg-opacity))"}}
            >
              Sign in with Google
            </button>
          </div>
          <div className="text-center">
            <Link href="/auth/forgot-password">
              <p className="text-blue-600 hover:underline">Forgot Password?</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
