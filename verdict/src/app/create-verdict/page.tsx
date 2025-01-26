'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/services/fireBaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    caseNumber: "",
    courtName: "",
    judgeName: "",
    plaintiff: "",
    defendant: "",
    statedFacts: "",
    verdict: "",
  });
  
  const [isFileUpload, setIsFileUpload] = useState(false); // Toggle between form and file upload
  const [file, setFile] = useState<File | null>(null); // Store the uploaded file
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFileUpload) {
      // Handle file upload
      if (!file) {
        toast.error("Please upload a file.");
        return;
      }
      try {
        console.log("File uploaded:", file.name);
        toast.success("File uploaded successfully!");
        setTimeout(() => router.push("/"), 2000);
      } catch (error) {
        console.error("Error uploading file: ", error);
        toast.error("Failed to upload file. Please try again.");
      }
    } else {
      // Handle form submission
      const isEmptyField = Object.values(formData).some((value) => value.trim() === "");
      if (isEmptyField) {
        toast.error("All fields are mandatory. Please fill out every field.");
        return;
      }

      try {
        const verdictCollection = collection(db, "verdicts");
        await addDoc(verdictCollection, formData);

        toast.success("Verdict created successfully!");
        setFormData({
          caseNumber: "",
          courtName: "",
          judgeName: "",
          plaintiff: "",
          defendant: "",
          statedFacts: "",
          verdict: "",
        });
        setTimeout(() => router.push("/"), 2000);
      } catch (error) {
        console.error("Error adding document: ", error);
        toast.error("Failed to create verdict. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen text-gray-900 flex flex-col"
      style={{
        backgroundImage: "url('/law-bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Navbar userName={null} onSignOut={() => {}} />
      <main className="flex-grow max-w-5xl mx-auto py-12 px-6 relative z-10">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          Create a New Verdict
        </h1>

        {/* Toggle between form and file upload */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsFileUpload(false)}
            className={`py-2 px-6 text-white rounded-l-lg font-medium ${
              !isFileUpload ? "bg-teal-700" : "bg-gray-500"
            }`}
          >
            Fill Form
          </button>
          <button
            onClick={() => setIsFileUpload(true)}
            className={`py-2 px-6 text-white rounded-r-lg font-medium ${
              isFileUpload ? "bg-teal-700" : "bg-gray-500"
            }`}
          >
            Upload File
          </button>
        </div>

        {isFileUpload ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl w-full max-w-3xl mx-auto"
          >
            <div>
              <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Verdict File (PDF)
              </label>
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                accept=".pdf"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-lg font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
            >
              Upload File
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl w-full max-w-3xl mx-auto"
          >
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Case Number
                </label>
                <input
                  type="text"
                  id="caseNumber"
                  name="caseNumber"
                  value={formData.caseNumber}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:shadow-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 mb-1">
                  Court Name
                </label>
                <input
                  type="text"
                  id="courtName"
                  name="courtName"
                  value={formData.courtName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:shadow-md"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="judgeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Judge Name
                </label>
                <input
                  type="text"
                  id="judgeName"
                  name="judgeName"
                  value={formData.judgeName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:shadow-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="plaintiff" className="block text-sm font-medium text-gray-700 mb-1">
                  Plaintiff
                </label>
                <input
                  type="text"
                  id="plaintiff"
                  name="plaintiff"
                  value={formData.plaintiff}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:shadow-md"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="defendant" className="block text-sm font-medium text-gray-700 mb-1">
                Defendant
              </label>
              <input
                type="text"
                id="defendant"
                name="defendant"
                value={formData.defendant}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:shadow-md"
                required
              />
            </div>
            <div>
              <label htmlFor="statedFacts" className="block text-sm font-medium text-gray-700 mb-1">
                Stated Facts
              </label>
              <textarea
                id="statedFacts"
                name="statedFacts"
                value={formData.statedFacts}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:shadow-md"
                rows={5}
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="verdict" className="block text-sm font-medium text-gray-700 mb-1">
                Verdict
              </label>
              <textarea
                id="verdict"
                name="verdict"
                value={formData.verdict}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:shadow-md"
                rows={5}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-lg font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
            >
              Create Verdict
            </button>
          </form>
        )}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default FormPage;
