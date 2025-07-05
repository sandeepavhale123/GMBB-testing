import React from "react";

interface StatusBadgeProps {
  status: "complete" | "pending" | "error";
  value?: string | number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, value }) => {
  const getStatusStyles = () => {
    const hasValue = value !== undefined && value !== null;
    switch (status) {
      case "complete":
        return hasValue
          ? "bg-green-500 text-white"
          : "bg-green-50 text-green-700 ring-1 ring-green-600/20 ring-inset";
      case "pending":
        return hasValue
          ? "bg-red-600 text-white"
          : "bg-red-50 text-red-600 ring-1 ring-red-600/10 ring-inset";
      case "error":
        return "bg-red-500 text-white";
      default:
        return hasValue
          ? "bg-green-500 text-white"
          : "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 ring-inset";
    }
  };

  const getStatusText = () => {
    if (value !== undefined) return value.toString();
    return status === "complete" ? "Complete" : "Pending";
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusStyles()}`}
    >
      {getStatusText()}
    </span>
  );
};
