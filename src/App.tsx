
import { AppProviders } from "@/providers/AppProviders";
import { ToastProviders } from "@/providers/ToastProviders";
import { AppRoutes } from "@/routes/AppRoutes";

const App = () => (
  <AppProviders>
    <ToastProviders />
    <AppRoutes />
  </AppProviders>
);

export default App;
