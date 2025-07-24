// src/pages/PlanExpiredPage.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PlanExpiredPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Plan Expired</h1>
      <div className="w-full flex items-center justify-center h-[400px] border rounded-lg bg-gray-50 mb-4">
        <img src="/planexpired.svg" alt="No Data" className="h-96" />
      </div>
      <p className="mb-6 text-gray-600">
        Your organization's subscription has expired. Please contact your admin
        or upgrade to regain access.
      </p>
    </div>
  );
};

export default PlanExpiredPage;
