import React, {createContext} from "react"

// Set up Context API
export const Context = createContext({
    items: [],
    tags: [],
    // addMedication: () => {},
    // removeMedication: () => {},
    // editMedication: () => {},
    // getMedication: () => {},
    // getMedications: () => {},
});

export const Provider = (props) => {
    return (
        <Context.Provider value={{
            items: [],
            tags: [],
        }}>
            {props.children}
        </Context.Provider>
    );
};

export default Context;