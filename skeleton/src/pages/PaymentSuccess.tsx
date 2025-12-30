
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new success page with payment type
    navigate("/success?type=payment", { replace: true });
  }, [navigate]);

  return null; // This component will redirect immediately
};
