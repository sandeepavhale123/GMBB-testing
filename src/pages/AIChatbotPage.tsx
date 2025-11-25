import React, { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { lazyImport } from "@/utils/lazyImport";

const AIChatbotContent = lazyImport(() =>
  import("../components/AIChatbot/AIChatbotContent").then((mod) => ({
    default: mod.AIChatbotContent,
  }))
);

const AIChatbotPage = () => {
  const [searchParams] = useSearchParams();
  
  // Extract keyword information from URL parameters
  const keyword = searchParams.get("keyword") || "";
  const keywordId = searchParams.get("keywordId") || "";

  return (
    <Suspense fallback={<div>Loading AI Chatbot...</div>}>
      <AIChatbotContent keyword={keyword} keywordId={keywordId} />
    </Suspense>
  );
};

export default AIChatbotPage;
