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
        console.log(regiments);
        return () => {
            console.log('Regiments unmounted');
        };
    }, [regiments]);

    const handleAddRegiment = (event) => {
        event.preventDefault();
        const form = event.target;

        // If a regiment already exists for this medication, update it
        if (regiments.find((regiment) => regiment.medicationId === form.id.value)) {
            let regiment = regiments.find((regiment) => regiment.medicationId === form.id.value);
            regiment = {
                id: regiment.id,
                medicationId: regiment.medicationId,
                times: Array.from({ length: frequency }).map((_, index) => form[`time_${index}`].value),
            };
            // regiment.times = Array.from({ length: frequency }).map((_, index) => form[`time_${index}`].value);
            dispatch(update(regiment));
            return;
        }

        const regiment = {
            id: regiments.length + 1,
            medicationId: form.id.value,
            times: Array.from({ length: frequency }).map((_, index) => form[`time_${index}`].value),
        };
            
        dispatch(add(regiment))
    }

    const removeTime = (event) => {
        event.preventDefault();
        if (frequency <= 1) {
            return;
        }
        setFrequency(frequency - 1);
    }

    const addTime = (event) => {
        event.preventDefault();
        setFrequency(frequency + 1);
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
            {regiments && regiments.length > 0 ? (
                <div>
                    <p>Here you can add, remove, and edit your regiments.</p>
                    <ul>
                        {regiments.map((regiment) => (
                            <li key={regiment.id}>
                                <div>{medications.find((medication) => medication.id == regiment.medicationId).name}</div>
                                <div>{regiment.times}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <p>You have no regiments. Add a regiment to get started.</p>
                </div>
            )}
            <p>Add, remove, and edit your medication regiments.</p>
            <form onSubmit={handleAddRegiment}>
                <h2>Regiment</h2>
                {/* select field with options of each medication */}
                {medications && medications.length > 0 ? (
                    <div>
                        <h3>Add a regiment</h3>
                        <p>Which medication do you want to add to your regiment?</p>
                        <select name='id'>
                            {medications.map((medication) => (
                                <option key={medication.id} id={medication.id} value={medication.id} label={medication.name}/>
                            ))}
                        </select>
                        <p>How many times do you take this medication?</p>
                        <div>
                            <h3>Times</h3>
                            <p>When do you take this medication?</p>
                            <footer>You may add multiple times.</footer>
                            <button type="button" onClick={removeTime} disabled={frequency <= 1}>Remove a time</button>
                            <button type="button" onClick={addTime}>Add a time</button>
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