import React from "react";
import ReactDOM from "react-dom/client";
//
import App from "./App";
import "./index.css";
import UserIdentificationListContainer from "./UserIdentificationListContainer";
import { hasToken } from "./utils";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {hasToken() ? <App /> : <UserIdentificationListContainer />}
  </React.StrictMode>
);
