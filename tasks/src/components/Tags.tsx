import React from 'react';
import { NewTagsForm } from './NewTagsForm';
// import { useSelector, useDispatch } from 'react-redux';

export function Tags() {
    return (
        <div className='section section-tags'>
            <h2>Tags</h2>
            <div className='tags column'>
                <NewTagsForm />
            </div>
        </div>
    );
}