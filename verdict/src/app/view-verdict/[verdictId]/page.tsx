'use client';

import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/services/fireBaseConfig';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';

function ViewVerdict() {
  const { verdictId } = useParams(); // Get dynamic route param
  const [verdict, setVerdict] = useState<any | null>(null); // Store verdict data

  useEffect(() => {
    if (verdictId) {
      fetchVerdictData();
      window.scrollTo(0, 0); // Scroll to top
    }
  }, [verdictId]);

  const fetchVerdictData = async () => {
    try {
      const docRef = doc(db, 'verdicts', verdictId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setVerdict(docSnap.data());
      } else {
        console.error('No such document!');
        toast.error('No verdict found');
      }
    } catch (error) {
      console.error('Error fetching verdict:', error);
      toast.error('Failed to fetch verdict');
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen text-gray-900"
      style={{
        backgroundImage: "url('/law-bg.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Navbar userName={null} onSignOut={() => {}} />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        {verdict ? (
          <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-4xl">
            <h1 className="text-3xl font-extrabold text-teal-700 text-center mb-8">
              Verdict Details
            </h1>
            <div className="space-y-6">
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Case Number:</span> {verdict.caseNumber}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Court Name:</span> {verdict.courtName}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Judge Name:</span> {verdict.judgeName}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Plaintiff:</span> {verdict.plaintiff}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Defendant:</span> {verdict.defendant}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Stated Facts:</span> {verdict.statedFacts}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Verdict:</span> {verdict.verdict}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg font-medium text-white">Loading verdict...</p>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Verdict Assistance System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default ViewVerdict;
