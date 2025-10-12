import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header.jsx";

// The MainLayout component is now responsible for rendering the animated background.
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      {/*  main content area is now a `relative` container. This is crucial for containing the absolutely positioned background.
      */}
      <main className="flex-grow grid relative">
        {/* The animated gradient is placed here, in the background. Because it's in the layout, it will persist across all pages that use this layout.
        */}
        <div className="animated-gradient absolute inset-0 z-0" />
        {/* The Outlet is now also `relative` and lifted to a higher z-index. This ensures that the page content (like your Dashboard or EditDeck page) renders on top of the animated background.
        */}
        <div className="relative z-10 h-full w-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

