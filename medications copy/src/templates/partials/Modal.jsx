import React from 'react';
export function Modal({content}) {
    return (
        <div className='modal'>
            <div className='modal-content'>
                {content}
            </div>
        </div>
    );
}