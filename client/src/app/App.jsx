import AppRoutes from "./router";
import AuthModal from "../modules/auth/AuthModal";
import { AuthProvider } from "../shared/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <AuthModal />
    </AuthProvider>
  );
}

export default App;
