
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { store } from "@/store/store";
import { MediaProvider } from "@/context/MediaContext";
import { ToastProvider } from "@radix-ui/react-toast";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import { useEffect } from "react";

// Initialize global cleanup observers for modal pointer-events issues
const initializeGlobalCleanup = () => {
  if (typeof window !== "undefined") {
    import("@/utils/domUtils").then(({ 
      startBodyStyleObserver, 
      addWindowFocusCleanup 
    }) => {
      startBodyStyleObserver();
      addWindowFocusCleanup();
    });
  }
};



interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  useEffect(() => {
    initializeGlobalCleanup();
  }, []);

  return (
    <Provider store={store}>
      <ApiKeyProvider>
        <ThemeProvider>
          <TooltipProvider>
            <ToastProvider>
              <BrowserRouter>
                <MediaProvider>{children}</MediaProvider>
              </BrowserRouter>
            </ToastProvider>
          </TooltipProvider>
        </ThemeProvider>
      </ApiKeyProvider>
    </Provider>
  );
};
