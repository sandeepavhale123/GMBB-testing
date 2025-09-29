import { AppProviders } from "@/providers/AppProviders";
import { ToastProviders } from "@/providers/ToastProviders";
import { AppRoutes } from "@/routes/AppRoutes";
import { ConditionalApiKeyProvider } from "@/providers/ConditionalApiKeyProvider";

const App = () => (
  <AppProviders>
    <ConditionalApiKeyProvider>
      <ToastProviders />
      <AppRoutes />
    </ConditionalApiKeyProvider>
  </AppProviders>
);

export default App;
