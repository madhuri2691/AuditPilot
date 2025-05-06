
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import Index from "@/pages/Index";
import Tasks from "@/pages/Tasks";
import Clients from "@/pages/Clients";
import Calendar from "@/pages/Calendar";
import Documents from "@/pages/Documents";
import FinancialAnalysis from "@/pages/FinancialAnalysis";
import Sampling from "@/pages/Sampling";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import BillTracking from "@/pages/BillTracking";
import AuditPerformance from "@/pages/AuditPerformance";
import Auth from "@/pages/Auth";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

import "./App.css";

// Public and protected route components
const ProtectedRouteLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const PublicRouteLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// App component with routing
function App() {
  const router = createBrowserRouter([
    {
      element: <PublicRouteLayout />,
      children: [
        {
          path: "/auth",
          element: <Auth />,
        },
      ],
    },
    {
      element: <ProtectedRouteLayout />,
      children: [
        {
          path: "/",
          element: <Index />,
        },
        {
          path: "/tasks",
          element: <Tasks />,
        },
        {
          path: "/clients",
          element: <Clients />,
        },
        {
          path: "/calendar",
          element: <Calendar />,
        },
        {
          path: "/documents",
          element: <Documents />,
        },
        {
          path: "/financial-analysis",
          element: <FinancialAnalysis />,
        },
        {
          path: "/sampling",
          element: <Sampling />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/bill-tracking",
          element: <BillTracking />,
        },
        {
          path: "/audit-performance",
          element: <AuditPerformance />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
