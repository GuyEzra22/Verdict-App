'use client';

import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/fireBaseConfig";
import { toast } from "react-toastify";

const DeleteVerdict: React.FC<{ verdictId: string; onDelete: () => void }> = ({
  verdictId,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this verdict?")) return;

    setLoading(true);
    try {
      const verdictRef = doc(db, "verdicts", verdictId);
      await deleteDoc(verdictRef);
      toast.success("Verdict deleted successfully!");
      onDelete();
    } catch (error) {
      console.error("Error deleting verdict:", error);
      toast.error("Failed to delete verdict. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg ${
        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
      }`}
    >
      {loading ? "Deleting..." : "Delete Verdict"}
    </button>
  );
};

export default DeleteVerdict;
