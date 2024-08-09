"use client";
import SignUp from "./auth/signup/page";
import { useSession } from 'next-auth/react';
import { useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.token) {
      localStorage.setItem('token', session.user.token);
      router.push('/Callerboard');  // Redirect to /Callerboard if authenticated
    }
  }, [session, router]);

  if (status === 'loading') {
    // Show a loading state while session is being checked
    return <div>Loading...</div>;
  }

  if (!session) {
    // Show the signup page if the user is not logged in or signed up
    return <SignUp />;
  }

  return null; // Render nothing as the user is redirected if authenticated
}
