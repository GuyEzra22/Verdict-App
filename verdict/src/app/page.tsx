'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/services/fireBaseConfig";
import Navbar from "@/components/Navbar";

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const { name, lastName } = userDoc.data();
            setUserName(`${name} ${lastName}`);
          } else {
            console.log("No user data found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFeatureClick = (link: string) => {
    if (!userName) {
      router.push("/sign-in");
    } else {
      router.push(link);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={userName} onSignOut={handleSignOut} />

      {/* Hero Section */}
      <header className="relative">
        <div className="w-full h-[70vh] bg-[url('/law-bg.jpg')] bg-cover bg-center flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-sm px-8 py-12 rounded-lg shadow-lg">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              Welcome to Verdict Assistance System
            </h1>
            <p className="text-xl font-light text-gray-700 mb-8">
              Streamline your courtroom workflow with powerful tools for managing documents, creating verdicts, and exporting them.
            </p>
            {userName ? (
              <p className="text-2xl font-semibold text-gray-900 mb-4">
                Hello, <span>{userName}</span> !
              </p>
            ) : (
              <button
                className="px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onClick={() => router.push("/sign-in")}
              >
                Sign In to Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "📂 Verdicts Dashboard",
              description: "Organize and store your courtroom files efficiently.",
              link: "/manage-verdicts",
              img: "/docs.jpg",
            },
            {
              title: "✍️ Create Verdicts",
              description: "Draft and finalize courtroom verdicts effortlessly.",
              link: "/create-verdict",
              img: "/verdicts.jpg",
            },
            {
              title: "📊 Case Analytics",
              description: "Gain insights into your verdicts with detailed analytics and trends.",
              link: "/case-analytics",
              img: "/judge.jpg",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleFeatureClick(feature.link)}
            >
              <img src={feature.img} alt={feature.title} className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-3xl font-bold text-teal-700 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Judge Anderson",
                feedback: "This platform has simplified my workflow immensely!",
              },
              {
                name: "Attorney Smith",
                feedback: "I love how easy it is to draft and manage verdicts.",
              },
              {
                name: "Clerk Johnson",
                feedback: "Quick access to case files has saved me so much time!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white text-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg"
              >
                <p className="italic">"{testimonial.feedback}"</p>
                <p className="font-bold mt-4">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Verdict Assistance System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
