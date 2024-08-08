// app/api/auth/[...nextauth]/route.ts
import { authOptions } from "../../../lib/auth"; // Import the auth options
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
