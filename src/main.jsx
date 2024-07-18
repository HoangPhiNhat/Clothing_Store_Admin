import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleProvider } from "@ant-design/cssinjs";

import store from "./redux/store.js";
const queryClient = new QueryClient();
import "./App.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StyleProvider layer>
          <App />
        </StyleProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
