import React from "react";

export function Board() {
    const total_spaces = 40;
    const rows = total_spaces / 10;
    const columns = total_spaces / 10;
    return (
        <div className="board">
            {Array.from(Array(40)).map(number => {
                return (
                    <div className="board-space">Space</div>
                )
            })}
        </div>
    )   
}