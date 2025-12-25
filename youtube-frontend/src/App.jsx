// import "./assets/sass/style.scss";
// import { Suspense } from "react";
// import { Outlet } from "react-router-dom";
// import Header from "./components/partials/Header";
// import Footer from "./components/partials/Footer";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import SideNav from "./components/partials/SideNav";

// const queryClient = new QueryClient();

// const LoadingScreen = () => (
//   <div
//     style={{
//       position: "fixed",
//       inset: 0,
//       // backgroundColor: "#000000",
//       zIndex: 10000,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center"
//     }}
//   >
//     <img src="/media/images/common/youtube.svg" alt="loading" width={200} />
//   </div>
// );

// function App() {
//   return (
//     <>
//     <QueryClientProvider client={queryClient}>
//       <Suspense fallback={<LoadingScreen />}>
//         <Header />
//         <SideNav/>
//         <main>
//           <Outlet />
//         </main>
//         {/* <Footer /> */}
//       </Suspense>
//     </QueryClientProvider>
//     </>
//   );
// }

// export default App;


import "./assets/sass/style.scss";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/partials/Header";
import Footer from "./components/partials/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideNav from "./components/partials/SideNav";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <img src="/media/images/common/youtube.svg" alt="loading" width={200} />
  </div>
);

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingScreen />}>
          <Header />
          <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
            <aside>
              <SideNav />
            </aside>
            <main>
              <Outlet />
            </main>
          </div>
          {/* <Footer /> */}
        </Suspense>
      </QueryClientProvider>
    </>
  );
}

export default App;