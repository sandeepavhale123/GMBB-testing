import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AIChatbotContent } from "@/components/AIChatbot/AIChatbotContent";

const AIChatBoxPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();

  // Extract keyword information from URL parameters
  const keyword = searchParams.get("keyword") || "";
  const keywordId = searchParams.get("keywordId") || "";

  return (
    <div className="h-full" style={{ border: "1px solid gray" }}>
      <AIChatbotContent
        keyword={keyword}
        keywordId={keywordId}
        projectId={projectId}
      />
    </div>
  );
};

export default AIChatBoxPage;
