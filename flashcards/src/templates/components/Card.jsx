import { Question } from 'phosphor-react';
import React, { useState } from 'react';

export function Card({title, description, children}) {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(!open);

    return (
        <div className='card'>
            <div className='card-header'>
                <Question className='card-icon' size={24} onClick={toggleOpen}/>
                <div className='card-title'>{title}</div>
            </div>
            {open && 
                <div className='card-description'>
                    {description}
                </div>
            }
            <div className='card-content'>
                {children}
            </div>
        </div>
    )
}