import React from 'react';

export function Item({ item }) {
    return (
        <tbody>
            <tr>
                <th>{item.status}</th>
                <td>{item.name}</td>
                <td className="tag">{item.tags}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
            </tr>
        </tbody>
    )
}