import { createRoot } from "react-dom/client";
import { App } from "./App";
import store from './state/store'
import { Provider } from 'react-redux'
import React from 'react'

const container = document.getElementById("root");
const root = createRoot(container)
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);