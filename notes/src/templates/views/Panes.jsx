import React from 'react';

const Manager = ({ children }) => (
    <div className='panes'>
        {children}
    </div>
);

export const Pane = ({ children }) => (
    <div className='pane'>
        {children}
    </div>
);

export default Manager;
