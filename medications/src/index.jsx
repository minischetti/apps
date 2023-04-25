import { createRoot } from "react-dom/client";
import App from "./App";
import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    BrowserRouter,
} from "react-router-dom";
import { EditMedications } from "./templates/views/EditMedications";
import { Medications } from "./templates/views/Medications";
import { Spinner } from "./templates/components/Spinner";
import { Provider as ReduxProvider } from 'react-redux'
import store from './store/store'
import { Regiments } from "./templates/views/Regiments";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "medications",
                    element: <Medications />,
                },
                {
                    path: "regiments",
                    element: <Regiments />
                },
            ],
        },
    ],
);

const container = document.getElementById("root");
const root = createRoot(container)
root.render(
    <ReduxProvider store={store}>
        <RouterProvider router={router}/>
    </ReduxProvider>
);