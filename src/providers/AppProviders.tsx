import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { store } from "@/store/store";
import { MediaProvider } from "@/context/MediaContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ToastProvider } from "@radix-ui/react-toast";

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
          <ToastProvider>
            <BrowserRouter>
              <NotificationProvider>
                <MediaProvider>{children}</MediaProvider>
              </NotificationProvider>
            </BrowserRouter>
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
};
