import React, { useEffect, useState } from "react";

interface CardDataStatsProps {
  title: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({ title }) => {
  const [total, setTotal] = useState<string>("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("https://ai-call-assistant.fly.dev/api/env", {
          headers: {
            Authorization: `Bearer ${token}` // Include token in the headers
          }
        });
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const result = await response.json();
        const count = Array.isArray(result) ? result.length : 0;
        setTotal(count.toString());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark" style={{ display: "flex", flexDirection: "column" }}>
      <h1
        className="text-title-md font-bold text-black dark:text-white"
        style={{ textAlign: "center" }}
      >
        {total}
      </h1>
      <span className="text-sm font-medium" style={{ textAlign: "center" }}>{title}</span>
    </div>
  );
};

export default CardDataStats;
