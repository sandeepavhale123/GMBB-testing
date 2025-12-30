import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { store } from "@/store/store";
import { NotificationProvider } from "@/context/NotificationContext";
import { ToastProvider } from "@radix-ui/react-toast";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Initialize global cleanup observers for modal pointer-events issues (runs once at module load)
if (typeof window !== "undefined") {
  import("@/utils/domUtils").then(({ 
    startBodyStyleObserver, 
    addWindowFocusCleanup 
  }) => {
    startBodyStyleObserver();
    addWindowFocusCleanup();
  });
}

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {

  return (
    <Provider store={store}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter basename="/skeleton/">
            <ToastProvider>
              <NotificationProvider>
                {children}
                <Toaster />
                <Sonner />
              </NotificationProvider>
            </ToastProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
};
