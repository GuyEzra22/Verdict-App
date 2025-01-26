'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/fireBaseConfig";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized.");
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user information to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        lastName,
        email,
        createdAt: new Date(),
      });

      router.push("/sign-in"); // Redirect to sign-in page after signup
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/signin.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-90 p-12 rounded-3xl shadow-lg w-full max-w-md mt-10 mb-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Sign Up</h1>
        <p className="text-center text-gray-500 mb-6">Join us and start your journey today!</p>
        <form onSubmit={handleSignup}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-base"
              placeholder="First Name"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-base"
              placeholder="Last Name"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-base"
              placeholder="example@domain.com"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-base"
              placeholder="Enter a strong password"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 text-base font-medium text-white rounded-lg shadow-lg transition-all duration-300 ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            } focus:outline-none`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account? <a href="/sign-in" className="text-indigo-600 hover:underline font-medium">Log in</a>
        </p>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a> and{" "}
            <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
