import React from 'react';

export function Item({ item }) {
    return (
        <div className='item'>
            <div className='item-name'>{item.name}</div>
            <div className='item-date'>{item.date}</div>
            <div className='item-tag'>
                {item.tag}
            </div>
        </div>
    )
}