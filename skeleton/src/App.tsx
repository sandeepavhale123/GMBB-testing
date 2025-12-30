import { AppProviders } from "@/providers/AppProviders";
import { AppRoutes } from "@/routes/AppRoutes";
import { ConditionalApiKeyProvider } from "@/providers/ConditionalApiKeyProvider";

const App = () => (
  <AppProviders>
    <ConditionalApiKeyProvider>
      <AppRoutes />
    </ConditionalApiKeyProvider>
  </AppProviders>
);

export default App;
