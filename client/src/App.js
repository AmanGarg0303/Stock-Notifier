import "./App.css";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import VerifyUserPage from "./pages/VerifyUserPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import Page404 from "./pages/Page404";
import About from "./pages/About";

function App() {
  const { currentUser } = useSelector((user) => user.user);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/dashboard",
      element: currentUser ? <Dashboard /> : <Page404 />,
    },
    {
      path: "/verifyuser/:id",
      element: <VerifyUserPage />,
    },
    {
      path: "/paymentsuccess",
      element: currentUser ? <PaymentSuccess /> : <Page404 />,
    },
    {
      path: "/paymentfail",
      element: currentUser ? <PaymentFail /> : <Page404 />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "*",
      element: <Page404 />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
