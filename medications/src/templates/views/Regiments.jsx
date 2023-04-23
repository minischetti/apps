import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from '../../store/regimentsSlice';
export function Regiments() {
    // use context to get medications
    const medications = useSelector((state) => state.medications);
    const regiments = useSelector((state) => state.regiments);
    const [frequency, setFrequency] = useState(0);
    const { location } = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Medications mounted');
        console.log(medications);
        console.log(location)
        return () => {
            console.log('Medications unmounted');
        };
    }, []);

    const handleAddRegiment = (event) => {
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
    };
    return (
        <div style={styles.container}>
            <h1>Regiments</h1>
            <p>Here you can add, remove, and edit your medication regiments.</p>
            <form onSubmit={handleAddRegiment}>
                <h2>Regiment</h2>
                {/* select field with options of each medication */}
                {medications && medications.length > 0 ? (
                    <div>
                        <select name='name'>
                            {medications.map((medication) => (
                                <option key={medication.id} value={medication.name}>
                                    {medication.name}
                                </option>
                            ))}
                        </select>
                        <p>How many times do you take this medication?</p>
                        <input onChange={handleFrequencyChange} type='number' name='frequency' placeholder='Frequency' />
                        <div>
                            <h3>Times</h3>
                            {Array.from({ length: frequency }).map((_, index) => (
                                <input key={`time_${index}`} type='time' name={`time_${index}`} />
                            ))}
                        </div>
                        <button type='submit'>Add Regiment</button>
                    </div>
                ) : (
                    <p>No medications found. Add a medication to your medicine cabinet to create a regiment.</p>
                )}

            </form>
        </div>
    );
}