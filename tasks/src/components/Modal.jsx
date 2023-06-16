import React from 'react';
export function Modal({children, closeAction}) {
    return (
        <div className='modal'>
            <button className='modal-close' onClick={closeAction}>Close</button>
            <div className='modal-content'>
                {children}
            </div>
        </div>
    );
}