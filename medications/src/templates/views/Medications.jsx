import React, { useContext, useEffect } from 'react';
import { Context } from '../../context';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function Medications() {
    // use context to get medications
    const medications = useSelector((state) => state.medications);
    const { location } = useLocation();

    useEffect(() => {
        console.log('Medications mounted');
        console.log(medications);
        console.log(location)
        return () => {
            console.log('Medications unmounted');
        };
    }, []);

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
            <div className='title'>Medications</div>
            <div>A list of medications you're taking.</div>
            <form>
                <input type='text' name='name' placeholder='Medication Name' />
                <button type='submit'>Add Medication</button>
            </form>
            <div style={styles.pills}>
                {medications.map((medication) => (
                    <div style={styles.pill} key={medication.id}>
                        <div className='medication-name'>{medication.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}