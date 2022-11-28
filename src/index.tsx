import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserCtxProvider } from "./context/userContext";
import { ProductCtxProvider } from "./context/productContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserCtxProvider>
        <ProductCtxProvider>
          <App />
        </ProductCtxProvider>
      </UserCtxProvider>
    </BrowserRouter>
  </React.StrictMode>
);
