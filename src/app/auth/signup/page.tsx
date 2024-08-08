"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = { email, password };
    try {
      const response = await fetch("https://ai-assistant-caller.fly.dev/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Sign up successful");
        router.push("/auth/signin");
      } else {
        const result = await response.json();
        alert("Error: " + result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Error signing up: " + error.message);
      } else {
        alert("Unknown error occurred");
      }
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="text-gray-900 text-3xl font-bold dark:text-white">
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M212.567 7.9054H198.033C198.701 9.54305 198.957 11.3199 198.776 13.0793C198.595 14.8387 197.984 16.5267 196.997 17.9946C196.01 19.4625 194.676 20.6652 193.114 21.4967C191.552 22.3283 189.809 22.7632 188.039 22.7632H124.247C122.477 22.7631 120.734 22.3281 119.172 21.4964C117.61 20.6648 116.277 19.462 115.289 17.9942C114.302 16.5263 113.691 14.8384 113.511 13.079C113.33 11.3197 113.585 9.54298 114.254 7.9054H100.678C94.6531 7.9054 88.8749 10.297 84.6146 14.5542C80.3543 18.8113 77.9609 24.5852 77.9609 30.6057V318.31C77.9609 324.331 80.3543 330.105 84.6146 334.362C88.8749 338.619 94.6531 341.011 100.678 341.011H212.567C218.592 341.011 224.37 338.619 228.63 334.362C232.891 330.105 235.284 324.331 235.284 318.31V30.6053C235.284 24.5848 232.891 18.811 228.63 14.554C224.37 10.297 218.592 7.9054 212.567 7.9054Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
        <div className="p-5 md:p-14 lg:p-16">
          <h1 className="mb-4 text-2xl font-bold text-black dark:text-white">
            Sign Up
          </h1>
          <form id="signupForm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-200 block text-sm font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-200 block text-sm font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
            <br/>
            <br/>
            <div className="text-center">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in with Google
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-center text-sm">
              Already have an account?{" "}
              <a
                href="/auth/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
