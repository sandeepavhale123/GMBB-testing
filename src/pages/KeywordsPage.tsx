
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { ThemeProvider } from "../context/ThemeContext";
import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/Sidebar";
import { SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Header } from "../components/Header";
import { KeywordsPage } from "../components/Keywords/KeywordsPage";

const KeywordsPageWithProviders: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-col h-full">
                <Header />
                <main className="flex-1 overflow-auto">
                  <div className="container mx-auto px-4 py-6">
                    <KeywordsPage />
                  </div>
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default KeywordsPageWithProviders;
