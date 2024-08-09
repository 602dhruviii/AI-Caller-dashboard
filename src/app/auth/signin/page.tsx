"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      const response = await fetch(
        "https://ai-assistant-caller.fly.dev/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        alert("Login successful");
        window.location.href = "/Callerboard";
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert(
        "Error logging in: " +
          (error instanceof Error
            ? error.message
            : "An unknown error occurred."),
      );
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex min-h-screen items-center justify-center">
      <div className="dark:bg-gray-800 w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-gray-900 dark:text-gray-100 mb-6 text-center text-2xl font-bold">
          Sign In
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-gray-700 dark:text-gray-300 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200 mt-1 block w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200 mt-1 block w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
          <div className="my-4 text-center">
            <button
              type="button"
              onClick={() => signIn("google", { prompt: "login" })}
              className="hover:bg-red-700 focus:ring-red-500 w-full rounded-md px-4 py-2 font-medium text-white focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "rgb(37 99 235 / var(--tw-bg-opacity))",
              }}
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
