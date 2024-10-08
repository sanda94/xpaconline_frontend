import { useState } from "react";
import Home from "./pages/home/Home";
import Summary from "./pages/summary/Summary";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Users from "./pages/users/Users";
import Products from "./pages/products/Products";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";
import User from "./pages/user/User";
import Product from "./pages/product/Product";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Rules from "./pages/rules/Rules";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

function App() {
  const Layout = () => {
    const { theme, themeColors } = useTheme();
    const [MenuSection, SetMenuSection] = useState(true);
    console.log(MenuSection);
    return (
      <div className="main" style={{ backgroundColor: themeColors.mainBg }}>
        <Navbar />
        <div className="container">
          <div
            style={{
              position: "absolute",
              left: "200px",
              top: "35px",
              cursor: "pointer",
            }}
            onClick={() => SetMenuSection(!MenuSection)}
          >
            <img
              src={theme == "light" ? "/ham_black.svg" : "/ham_white.svg"}
              style={{ width: "20px" }}
            />
          </div>
          {MenuSection ? (
            <div className="menuContainer" style={{ position: "relative" }}>
              <Menu />
            </div>
          ) : null}
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/summary",
          element: <Summary />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/users/:id",
          element: <User />,
        },
        {
          path: "/products/:id",
          element: <Product />,
        },
        {
          path: "/rules",
          element: <Rules />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
