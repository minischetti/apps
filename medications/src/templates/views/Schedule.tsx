import React from "react";
import { useSelector } from "react-redux";
import { Timeline } from "../partials/Timeline";
import { Medications } from "./Medications";

export function Schedule() {
    // medications from redux store
    const medications = useSelector((state) => state.medications);

    return (
        <div className="row">
            <Medications />
            <Timeline />
        </div>
    );
}