'use client';
import React from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  userName: string | null;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, onSignOut }) => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/"); // Navigate to the home page
  };

  return (
    <header className="text-gray-900 py-4 px-6 shadow-lg bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="flex items-center"
          
        >
          <img
            src="/verdict logo.jpg"
            alt="logo"
            className="h-13 w-20 object-contain mr-3 cursor-pointer"
            onClick={handleLogoClick}
          />
          <h1 className="text-3xl font-extrabold">Verdict Assistance System</h1>
        </div>
        {userName && (
          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
