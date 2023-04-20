import React from "react";

export function Breadcrumbs({ pages }) {
    console.log(pages);
    return (
        <div className="breadcrumbs">
            {pages.map(([page, active], index) => (
                <div key={index} className={`breadcrumb${active && " active"}`}>{page}</div>
            ))}
        </div>
    )
}