import AuthFormPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

export const publicRoutes = [
  {
    path: "/",
    element: <AuthFormPage />,
  },
  {
    path: "/sign-in",
    element: <AuthFormPage />,
  },
  {
    path: "/sign-up",
    element: <AuthFormPage />,
  },
];

export const privateRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/product/:id", element: <ProductDetailsPage /> },
];
