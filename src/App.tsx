
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner";

import "./App.css";

// Protected route wrapper
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

// Public route wrapper - redirects to home if already logged in
const PublicRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

// App component with routing
const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      element: <PublicRoute />,
      children: [
        {
          path: "/auth",
          element: <Auth />,
        },
      ],
    },
    {
      element: <ProtectedRoute />,
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

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
