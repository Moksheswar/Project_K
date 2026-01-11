"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getSignupErrorMessage(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please login.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/operation-not-allowed":
      return "Signup is currently disabled. Please contact support.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "Signup failed. Please try again.";
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/login");
    } catch (err: any) {
      setError(getSignupErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 space-y-4 border p-6 rounded">
        <h1 className="text-2xl font-bold">Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          className="w-full border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-black text-white p-2 disabled:opacity-50  cursor-pointer hover:bg-white hover:text-black"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
