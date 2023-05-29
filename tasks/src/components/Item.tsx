import React from 'react';

export function Item({ item }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Tags</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{item.name}</td>
                    <td>{item.tags}</td>
                    <td>{item.date}</td>
                </tr>
            </tbody>
        </table>
    )
}