import { Outlet } from "@tanstack/react-router";
import NavBar from "./components/NavBar";

const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
