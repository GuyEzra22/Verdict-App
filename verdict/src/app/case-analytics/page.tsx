'use client';

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/fireBaseConfig";
import Navbar from "@/components/Navbar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CaseAnalytics: React.FC = () => {
  const [verdicts, setVerdicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerdicts = async () => {
      setLoading(true);
      try {
        const verdictCollection = collection(db, "verdicts");
        const querySnapshot = await getDocs(verdictCollection);

        const verdictList = querySnapshot.docs.map((doc) => doc.data());
        setVerdicts(verdictList);
      } catch (error) {
        console.error("Error fetching verdicts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerdicts();
  }, []);

  // Aggregate data for charts
  const verdictCountsByCourt = verdicts.reduce((acc, verdict) => {
    const court = verdict.courtName || "Unknown";
    acc[court] = (acc[court] || 0) + 1;
    return acc;
  }, {});

  const monthlyVerdictCounts = verdicts.reduce((acc, verdict) => {
    const date = new Date(verdict.date || Date.now());
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // Data for charts
  const barChartData = {
    labels: Object.keys(verdictCountsByCourt),
    datasets: [
      {
        label: "Verdicts by Court",
        data: Object.values(verdictCountsByCourt),
        backgroundColor: "rgba(38, 166, 154, 0.8)",
        borderRadius: 5,
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(monthlyVerdictCounts),
    datasets: [
      {
        label: "Monthly Verdicts",
        data: Object.values(monthlyVerdictCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar userName={null} onSignOut={() => {}} />
      <main className="flex-grow max-w-7xl mx-auto py-12 px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Case Analytics
        </h1>
        {loading ? (
          <p className="text-center text-lg font-medium text-gray-700">
            Loading analytics...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Verdicts by Court */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Verdicts by Court
              </h2>
              <div className="w-full h-64">
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Monthly Verdict Trends */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Monthly Verdict Trends
              </h2>
              <div className="w-full h-64">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Verdict Assistance System. All rights reserved.
          </p>
          <p className="mt-2 text-gray-400">
            Enhancing efficiency and accuracy in the courtroom ⚖️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CaseAnalytics;
