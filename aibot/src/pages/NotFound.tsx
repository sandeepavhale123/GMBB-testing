import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const NotFound = () => {
  const { t } = useI18nNamespace("pages/notfound");
  const location = useLocation();
  const navigate = useNavigate();
  const { profileData } = useProfile();
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // ✅ Decide fallback dynamically
  const getFallbackPath = () => {
    return "/dashboard";
  };

  const handleBackHome = () => {
    // Replace instead of push → removes the 404 from history
    navigate(getFallbackPath(), { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-full">
            <Search className="w-24 h-24 text-gray-400" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-gray-300 mb-4 tracking-tight">
          {t("notFound.title")}
        </h1>

        {/* Oops! Text */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {t("notFound.oops")}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          {t("notFound.description")}
        </p>

        {/* Back to Home Button */}
        <Button onClick={handleBackHome} className="px-8 py-3 text-base">
          {t("notFound.backToHome")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
