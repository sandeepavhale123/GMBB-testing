import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LoaderCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const VerifySignupPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      toast({
        title: "Verification Failed",
        description: "Missing session ID in URL.",
        variant: "destructive",
      });
      return;
    }

    const verifySignup = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/verify-signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        if (!res.ok) {
          throw new Error("Verification failed");
        }

        const data = await res.json();
        console.log("✅ Verification success:", data);
        setStatus("success");

        toast({
          title: "Signup Verified",
          description: data.message,
        });

        // Remove query params from URL after 2 seconds
        // setTimeout(() => {
        //   searchParams.delete("session_id");
        //   setSearchParams(searchParams, { replace: true });
        // }, 2000);
      } catch (err) {
        console.error("❌ Verification failed:", err);
        setStatus("error");

        toast({
          title: "Verification Failed",
          description: err.message,
          variant: "destructive",
        });
      }
    };

    verifySignup();
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center space-y-4">
        {status === "loading" && (
          <>
            <LoaderCircle
              className="animate-spin mx-auto text-blue-500"
              size={48}
            />
            <p className="text-gray-700 text-lg">Verifying your account...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="text-green-500 mx-auto" size={48} />
            <p className="text-lg font-semibold text-green-700">
              Signup Verified!
            </p>
            <p className="text-gray-600">
              You can now log in and start using your account.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="text-red-500 mx-auto" size={48} />
            <p className="text-lg font-semibold text-red-700">
              Verification Failed
            </p>
            <p className="text-gray-600">
              Please check your email for a valid signup link or try again.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-4 bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700"
            >
              Back to Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};
