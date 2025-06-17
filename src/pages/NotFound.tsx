
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

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
          404
        </h1>

        {/* Oops! Text */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Oops!
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          We can't find the page you're looking for.
        </p>

        {/* Back to Home Button */}
        <Button asChild className="px-8 py-3 text-base">
          <Link to="/">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
