import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // a vista default
    loader: rootLoader,
    action: rootAction,
    errorElement: <ErrorPage />,
    children: [
      // apresentar as outras routes como children da root, para nao recarregar
      {
        errorElement: <ErrorPage />, // errorElement é uma pathless route: nao muda o url
        children: [
          {
            index: true,
            element: <Index />,
          }, // match route index quando o user está no parent path exato
          {
            path: "contacts/:contactId", // ':contactId': match dinamico com cada id, URL Param
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
            errorElement: <div>Oops! There was an error.</div>, // o erro carrega na direita por estar num child route
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>, // o erro carrega na direita por estar num child route
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
