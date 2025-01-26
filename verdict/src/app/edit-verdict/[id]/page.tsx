'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/fireBaseConfig';
import Navbar from '@/components/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditVerdict: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [verdict, setVerdict] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerdict = async () => {
      try {
        const docRef = doc(db, 'verdicts', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVerdict({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error('Verdict not found.');
          router.push('/manage-verdicts');
        }
      } catch (error) {
        console.error('Error fetching verdict:', error);
        toast.error('Failed to fetch verdict.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerdict();
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVerdict((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'verdicts', id as string);
      await updateDoc(docRef, verdict);
      toast.success('Verdict updated successfully!');
      router.push('/manage-verdicts');
    } catch (error) {
      console.error('Error updating verdict:', error);
      toast.error('Failed to update verdict.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Loading verdict...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/law-bg.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Navbar userName={null} onSignOut={() => {}} />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-4xl">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Edit Verdict</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: 'Case Number', name: 'caseNumber', type: 'text' },
              { label: 'Court Name', name: 'courtName', type: 'text' },
              { label: 'Judge Name', name: 'judgeName', type: 'text' },
              { label: 'Plaintiff', name: 'plaintiff', type: 'text' },
              { label: 'Defendant', name: 'defendant', type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={verdict?.[field.name] || ''}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required={field.name !== 'judgeName'}
                />
              </div>
            ))}
            {[
              { label: 'Stated Facts', name: 'statedFacts' },
              { label: 'Verdict', name: 'verdict' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <textarea
                  name={field.name}
                  value={verdict?.[field.name] || ''}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required={field.name === 'verdict'}
                />
              </div>
            ))}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/manage-verdicts')}
                className="py-2 px-4 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 focus:ring-2 focus:ring-teal-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditVerdict;
