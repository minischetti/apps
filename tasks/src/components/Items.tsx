import React from 'react';

export function Items({children}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Item</th>
                    <th>Tags</th>
                    <th>Reminder</th>
                    <th>Time</th>
                </tr>
            </thead>
            {children}
        </table>
    );
}