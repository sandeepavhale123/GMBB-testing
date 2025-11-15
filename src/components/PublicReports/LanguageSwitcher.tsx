import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import i18n, { loadAllNamespaces } from "@/i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import { shouldSkipProfileAPI } from "@/utils/routeUtils";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { languageService, getLanguageName } from "@/services/languageService";
import { toast } from "@/hooks/use-toast";
import GB from "country-flag-icons/react/3x2/GB";
import ES from "country-flag-icons/react/3x2/ES";
import DE from "country-flag-icons/react/3x2/DE";
import IT from "country-flag-icons/react/3x2/IT";
import FR from "country-flag-icons/react/3x2/FR";
import { useLocation, useNavigate } from "react-router-dom";

interface Language {
  code: string;
  name: string;
  flag: string;
  FlagComponent: React.ComponentType<any>;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧", FlagComponent: GB },
  { code: "es", name: "Spanish", flag: "🇪🇸", FlagComponent: ES },
  { code: "de", name: "German", flag: "🇩🇪", FlagComponent: DE },
  { code: "it", name: "Italian", flag: "🇮🇹", FlagComponent: IT },
  { code: "fr", name: "French", flag: "🇫🇷", FlagComponent: FR },
];

interface LanguageSwitcherProps {
  className?: string;
  buttonVariant?: "default" | "ghost" | "outline";
  showLabel?: boolean;
  reportId: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  buttonVariant = "ghost",
  showLabel = false,
  reportId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuthRedux();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLangCode = i18n.language || "en";
  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = async (langCode: string) => {
    try {
      // Always update i18n immediately for responsive UI
      loadAllNamespaces(langCode);
      await i18n.changeLanguage(langCode);
      setIsOpen(false);
      // 2️⃣ Update URL query param (?lang=xx)
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("lang", langCode);
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });

      // Only call backend API if:
      // 1. User is authenticated
      // 2. Not on a public report route
      const isPublicRoute = shouldSkipProfileAPI();
      const shouldUpdateBackend = isAuthenticated && !isPublicRoute;

      if (shouldUpdateBackend) {
        // Call API in background (don't await to keep UI responsive)
        languageService
          .updateLanguage(getLanguageName(langCode))
          .catch((error) => {
            console.error("Failed to sync language with backend:", error);
          });
      }
    } catch (error) {
      console.error("Failed to change language:", error);
      toast({
        title: "Error",
        description: "Failed to change language. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("relative z-[100]", className)}>
      <Button
        ref={buttonRef}
        variant={buttonVariant}
        size="icon"
        className="flex items-center justify-center hover:bg-transparent p-0 w-7 h-7 "
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <div className="rounded-full overflow-hidden flex items-center justify-center w-7 h-7 shadow-blue-glow">
          <currentLanguage.FlagComponent className="w-full h-full scale-[2.5]" />
        </div>
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute top-full mt-2 bg-background border border-border rounded-lg shadow-lg z-50",
            isMobile
              ? "left-1/2 transform -translate-x-1/2 w-64 max-w-[calc(100vw-2rem)]"
              : "right-0 w-64"
          )}
        >
          <div className="p-3">
            <h3 className="text-sm font-semibold text-foreground mb-2 px-2">
              Language
            </h3>

            <div className="space-y-1">
              {languages.map((language) => {
                const isActive = language.code === currentLangCode;

                return (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-left",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                      <language.FlagComponent className="w-full h-full scale-[1.5]" />
                    </div>

                    <span
                      className={cn(
                        "text-sm flex-1 text-black",
                        isActive ? "font-semibold" : "font-normal"
                      )}
                    >
                      {language.name}
                    </span>

                    {isActive && (
                      <Check
                        className="w-4 h-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
