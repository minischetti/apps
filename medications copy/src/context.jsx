import React, {createContext} from "react"
import mockMedications from "./data/medications";

// Set up Context API
export const Context = createContext({
    medications: [],
    regiments: [],
    // addMedication: () => {},
    // removeMedication: () => {},
    // editMedication: () => {},
    // getMedication: () => {},
    // getMedications: () => {},
});

export const Provider = (props) => {
    return (
        <Context.Provider value={{
            medications: mockMedications,
        }}>
            {props.children}
        </Context.Provider>
    );
};

export default Context;