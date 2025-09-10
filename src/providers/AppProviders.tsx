import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { store } from "@/store/store";
import { MediaProvider } from "@/context/MediaContext";
import { ToastProvider } from "@radix-ui/react-toast";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeProvider>
        <TooltipProvider>
          <ToastProvider>
            <BrowserRouter>
              <MediaProvider>{children}</MediaProvider>
            </BrowserRouter>
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  </QueryClientProvider>
);
