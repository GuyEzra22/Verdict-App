'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/fireBaseConfig";
import Navbar from "@/components/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Edit2, Plus } from "lucide-react";



const ManageDocuments: React.FC = () => {
  const [verdicts, setVerdicts] = useState<any[]>([]);
  const [filteredVerdicts, setFilteredVerdicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    caseNumber: "",
    courtName: "",
    judgeName: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchVerdicts = async () => {
      setLoading(true);
      try {
        const verdictCollection = collection(db, "verdicts");
        const querySnapshot = await getDocs(verdictCollection);

        const verdictList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVerdicts(verdictList);
        setFilteredVerdicts(verdictList);
      } catch (error) {
        console.error("Error fetching verdicts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerdicts();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const filtered = verdicts.filter((verdict) => {
      const caseNumberMatch = verdict.caseNumber
        .toLowerCase()
        .includes(filters.caseNumber.toLowerCase());
      const courtNameMatch = verdict.courtName
        .toLowerCase()
        .includes(filters.courtName.toLowerCase());
      const judgeNameMatch = verdict.judgeName
        .toLowerCase()
        .includes(filters.judgeName.toLowerCase());

      return caseNumberMatch && courtNameMatch && judgeNameMatch;
    });
    setFilteredVerdicts(filtered);
  }, [filters, verdicts]);

  const deleteVerdict = async (verdictId: string) => {
    try {
      await deleteDoc(doc(db, "verdicts", verdictId));
      setVerdicts((prevVerdicts) =>
        prevVerdicts.filter((verdict) => verdict.id !== verdictId)
      );
      toast.success("Verdict deleted successfully!");
    } catch (error) {
      console.error("Error deleting verdict:", error);
      toast.error("Failed to delete verdict. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen text-gray-900"
      style={{
        backgroundImage: "url('/law-bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Navbar userName={null} onSignOut={() => {}} />
      <main className="flex-grow max-w-7xl mx-auto py-12 px-8">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-white">
          Manage Verdicts
        </h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="caseNumber"
              placeholder="Filter by Case Number"
              value={filters.caseNumber}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              name="courtName"
              placeholder="Filter by Court Name"
              value={filters.courtName}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              name="judgeName"
              placeholder="Filter by Judge Name"
              value={filters.judgeName}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-lg font-medium text-white">
            Loading documents...
          </p>
        ) : (
          <div
            className="overflow-x-auto bg-white rounded-lg shadow-lg"
            style={{ minHeight: "400px" }}
          >
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="py-3 px-6 text-left">Case Number</th>
                  <th className="py-3 px-6 text-left">Court Name</th>
                  <th className="py-3 px-6 text-left">Judge Name</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVerdicts.length > 0 ? (
                  filteredVerdicts.map((verdict) => (
                    <tr
                      key={verdict.id}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="py-3 px-6">{verdict.caseNumber}</td>
                      <td className="py-3 px-6">{verdict.courtName}</td>
                      <td className="py-3 px-6">{verdict.judgeName}</td>
                      <td className="py-3 px-6">
                        <button
                          className="text-blue-600 hover:underline mr-4"
                          onClick={() =>
                            router.push(`/view-verdict/${verdict.id}`)
                          }
                        >
                          View
                        </button>
                        <button
                          className="text-yellow-600 hover:underline mr-4"
                          onClick={() =>
                            router.push(`/edit-verdict/${verdict.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => deleteVerdict(verdict.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No verdicts found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Verdict Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.push("/create-verdict")}
            className="flex items-center bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2 px-4 rounded-lg shadow-md hover:from-teal-700 hover:to-teal-800 transition-transform transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Verdict
          </button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Verdict Assistance System. All
            rights reserved.
          </p>
          <p className="mt-2 text-gray-400">
            Enhancing efficiency and accuracy in the courtroom ⚖️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ManageDocuments;
