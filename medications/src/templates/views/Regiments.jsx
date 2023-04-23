import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from '../../store/regimentsSlice';
export function Regiments() {
    // use context to get medications
    const medications = useSelector((state) => state.medications);
    const regiments = useSelector((state) => state.regiments);
    const [frequency, setFrequency] = useState(1);
    const { location } = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Regiments mounted');
        console.log(medications);
        console.log(location)
        return () => {
            console.log('Regiments unmounted');
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

    const removeTime = (event) => {
        event.preventDefault();
        setFrequency(frequency - 1);
    }

    const addTime = (event) => {
        event.preventDefault();
        setFrequency(frequency + 1);
        // setFrequency(event.target.value);
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
            <p>Add, remove, and edit your medication regiments.</p>
            <form onSubmit={handleAddRegiment}>
                <h2>Regiment</h2>
                {/* select field with options of each medication */}
                {medications && medications.length > 0 ? (
                    <div>
                        <h3>Add a regiment</h3>
                        <p>What medication do you want to add to your regiment?</p>
                        <select name='name'>
                            {medications.map((medication) => (
                                <option key={medication.id} value={medication.name}>
                                    {medication.name}
                                </option>
                            ))}
                        </select>
                        <p>How many times do you take this medication?</p>
                        <div>
                            <h3>Times</h3>
                            <p>When do you take this medication?</p>
                            <footer>You may add multiple times.</footer>
                            <button type="button" onClick={removeTime}>Add</button>
                            <button type="button" onClick={addTime}>Add</button>
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