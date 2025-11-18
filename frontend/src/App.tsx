import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Layout";

function App() {
  return (
    <HeroUIProvider>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App;

