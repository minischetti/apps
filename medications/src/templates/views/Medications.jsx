import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from '../../store/medicationsSlice';
import { Alarm } from '@phosphor-icons/react';
import { Medication } from '../partials/Medication';

export function Medications() {
    // use context to get medications
    const { location } = useLocation();
    const medications = useSelector((state) => state.medications);
    const [frequency, setFrequency] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Medications mounted');
        console.log(medications);
        console.log(location)
        return () => {
            console.log('Medications unmounted');
        };
    }, []);

    const handleAddMedication = (event) => {
        event.preventDefault();
        const form = event.target;

        // check if medication name is empty
        if (!form.name.value) {
            alert('Please enter a medication name.');
            return;
        }

        // check if medication already exists
        if (medications.find((medication) => medication.name === form.name.value)) {
            alert('Medication already exists.');
            return;
        }

        const medication = {
            id: medications.length + 1,
            name: form.name.value,
        };
        dispatch(add(medication))
    }

    const handleFrequencyChange = (event) => {
        event.preventDefault();
        setFrequency(event.target.value);
    };

    const styles = {
        container: {
            border: '1px solid black',
            padding: '10px',
        },
        pills: {
            display: 'grid',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
        },
        pill: {
            backgroundColor: 'blue',
            color: 'white',
            borderRadius: '100px',
            display: 'inline-block',
            textAlign: 'center',
            padding: '5px 10px',
        },
    };
    return (
        <div style={styles.container}>
            <h1>Medicine Cabinet</h1>
            <p>Here you can add, remove, and edit your medications.</p>
            <form onSubmit={handleAddMedication}>
                <input type='text' name='name' placeholder='Medication Name' />
                <h2>Regiment</h2>
                <p>How many times do you take this medication?</p>
                <input onChange={handleFrequencyChange} type='number' name='frequency' placeholder='Frequency' />
                <div>
                    <h3>Times</h3>
                    {Array.from({ length: frequency }).map((_, index) => (
                        <input key={`time_${index}`} type='time' name={`time_${index}`} />
                    ))}
                    {/* <select name='medication'>
                    <option key={_} value={_}>{_}</option>
                </select> */}
                </div>
                <button type='submit'>Add Medication</button>
            </form>
            <div style={styles.pills}>
                {medications.map((medication) => (
                    <div style={styles.pill} key={medication.id}>
                        <div className='medication-name'>{medication.name}</div>
                        <div className='medication-dosage'></div>
                        <div className='medication-frequency'></div>
                    </div>
                ))}
            </div>
        </div>
    );
}