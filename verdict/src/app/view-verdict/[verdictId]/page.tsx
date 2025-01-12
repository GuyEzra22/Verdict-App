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
        console.log('Document:', docSnap.data());
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar userName={null} onSignOut={function (): void {
              throw new Error('Function not implemented.');
          } } />
      <main className="flex-grow max-w-4xl mx-auto py-12 px-6 lg:px-12">
        {verdict ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold text-teal-700 mb-6">Verdict Details</h1>
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
          <p className="text-center text-lg font-medium text-gray-700">Loading verdict...</p>
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
