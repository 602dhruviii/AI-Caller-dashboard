"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const metadata = {
  title: "Next.js SignIn Page | AI-CALLER - Next.js Dashboard Template",
  description: "This is Next.js Signin Page AI-CALLER Dashboard Template",
};

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email,
      password
    };

    try {
      const response = await fetch('https://ai-call-assistant.fly.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        alert('Login successful');
        window.location.href = '/Callerboard'; // Redirect to update env page
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert('Error logging in: ' + error.message);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
              </p>
              <span className="mt-15 inline-block">
                <svg
                  width="350"
                  height="350"
                  viewBox="0 0 350 350"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG Content */}
                </svg>
              </span>
            </div>
          </div>
          <div className="w-full xl:w-1/2 p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md"
                >
                  Sign In
                </button>
              </div>
            </form>
            {message && <p className="text-green-500">{message}</p>}
          </div>
        </div>
      </div>
  );
};

export default SignIn;
