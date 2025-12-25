import "./assets/sass/style.scss";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/partials/Header";
import Footer from "./components/partials/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#323131",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <img src="/media/images/common/main-logo.svg" alt="loading" width={200} />
  </div>
);

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingScreen />}>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </Suspense>
    </QueryClientProvider>
    </>
  );
}

export default App;
