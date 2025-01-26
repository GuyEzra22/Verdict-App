'use client';

import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/fireBaseConfig";
import { toast } from "react-toastify";

const EditVerdict: React.FC<{ verdict: any; onSave: () => void }> = ({
  verdict,
  onSave,
}) => {
  const [formData, setFormData] = useState(verdict);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const verdictRef = doc(db, "verdicts", verdict.id);
      await updateDoc(verdictRef, formData);
      toast.success("Verdict updated successfully!");
      onSave();
    } catch (error) {
      console.error("Error updating verdict:", error);
      toast.error("Failed to update verdict. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Verdict</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="caseNumber"
          value={formData.caseNumber}
          onChange={handleChange}
          placeholder="Case Number"
          className="block w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          name="courtName"
          value={formData.courtName}
          onChange={handleChange}
          placeholder="Court Name"
          className="block w-full px-4 py-2 border rounded-lg"
        />
        <textarea
          name="statedFacts"
          value={formData.statedFacts}
          onChange={handleChange}
          placeholder="Stated Facts"
          className="block w-full px-4 py-2 border rounded-lg"
          rows={4}
        />
        <textarea
          name="verdict"
          value={formData.verdict}
          onChange={handleChange}
          placeholder="Verdict"
          className="block w-full px-4 py-2 border rounded-lg"
          rows={4}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-2 bg-teal-600 text-white rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditVerdict;
