import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Medication } from '../partials/Medication';

export function Home() {
    const medications = useSelector((state) => state.medications);
    const regiments = useSelector((state) => state.regiments);
    const dispatch = useDispatch();

    return (
        <div className='medications'>

        </div>
    )
}