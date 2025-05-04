
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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

import "./App.css";

const router = createBrowserRouter([
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
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
