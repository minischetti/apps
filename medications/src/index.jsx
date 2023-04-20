import { createRoot } from "react-dom/client";
import { App } from "./App";
import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    BrowserRouter,
} from "react-router-dom";
import { EditMedications } from "./templates/views/EditMedications";
import { Medications } from "./templates/views/Medications";
import { Spinner } from "./templates/components/Spinner";
import { Context } from "./context";
import mockMedications from "./data/medications";


const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "medications",
                    element: <Medications />,
                    children: [
                        {
                            index: true,
                            element: <Spinner />,

                        },
                        {
                            path: "edit",
                            element: <EditMedications />,
                        },
                    ],
                }
            ],
        },
    ],
);

const container = document.getElementById("root");
const root = createRoot(container)
root.render(
    <Context.Provider
        value={{
            medications: [...mockMedications],
            addMedication: (event, context) => {
                console.log("addMedication");
                const name = event.target.name.value;
                const id = name.toLowerCase().replace(' ', '-');
                if (
                    name.length === 0 ||
                    name === ' ' ||
                    context.medications.find((medication) => medication.id === id)
                ) {
                    return;
                }

            },
            editMedication: (event, context) => {
                const name = event.target.name.value;
                const dosage = event.target.dosage.value;
                const frequency = event.target.frequency.value;
                // Find the medication
                const medication = medications.find((medication) => medication.id === event.target.id.value);
                // Update the medication
                if (medication) {
                    medication.name = name;
                    medication.dosage = dosage;
                    medication.frequency = frequency;
                }
            }
        }}
    >
        <RouterProvider router={router}>
            <App></App>
        </RouterProvider>
    </Context.Provider>
);