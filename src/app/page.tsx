"use client";
import SignUp from "./auth/signup/page";
import { useSession } from 'next-auth/react';
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.token) {
      localStorage.setItem('token', session.user.token);
    }
  }, [session]);

  return (
    <>
      <SignUp />
    </>
  );
}
