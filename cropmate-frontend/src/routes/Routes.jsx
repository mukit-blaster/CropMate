import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
import Coverage from "../pages/Coverage";
import Hire from "../pages/Hire";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import CropPredictor from "../pages/CropPredictor";
import DiseaseDetector from "../pages/DiseaseDetector";
import AdminDashboard from "../pages/AdminDashboard";
import Knowledge from "../pages/Knowledge";
import Sell from "../pages/Sell";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component:Home
        },
        {
            path: "/coverage",
            Component: Coverage,
            loader: () => fetch('/serviceCenters.json').then(res => res.json())
        },
        {
            path: "/hire",
            element: <PrivateRoute><Hire></Hire></PrivateRoute> 
        },
        {
          path:"/predict",
          element: <CropPredictor></CropPredictor>
        },
        {
          path:"/disease-detect",
          element: <DiseaseDetector></DiseaseDetector>
        },
        {
          path:"/admin",
          element: <AdminRoute><AdminDashboard></AdminDashboard></AdminRoute>
        },
        {
          path:"/knowledge",
          element: <Knowledge></Knowledge>
        },
        {
          path:"/sell",
          element: <Sell></Sell>
        },
        {
          path: "*",
          element: <NotFound />
        }
    ]
  },
   {
    path: "/",
    Component: AuthLayout,
    children: [
      {
       path: "login", Component: Login
      },
      {
        path: "register", Component: Register
      }
    ]
  },
]);