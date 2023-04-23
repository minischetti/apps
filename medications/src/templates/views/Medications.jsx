import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from '../../store/medicationsSlice';
import { set } from '../../store/modalSlice.js';
import { Alarm } from '@phosphor-icons/react';
import { Medication } from '../partials/Medication';
import { Table, TableBody, TableHead } from '@mui/material';

export function NewMedication() {
    const { location } = useLocation();
    const medications = useSelector((state) => state.medications);
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

    const styles = {
        container: {
            border: '1px solid black',
            padding: '10px',
        },
    };
    return (
        <div style={styles.container}>
            <h1>Add Medication</h1>
            <p>Here you can add, remove, and edit your medications.</p>
            <form onSubmit={handleAddMedication}>
                <input type='text' name='name' placeholder='Medication Name' />
                <button type='submit'>Add Medication</button>
            </form>
        </div>
    );
}

function MedicationsList() {
    const medications = useSelector((state) => state.medications);
    const styles = {
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
        <div style={styles.pills}>
            {medications.map((medication) => (
                <div style={styles.pill} key={medication.id}>
                    <div className='medication-name'>{medication.name}</div>
                    <div className='medication-dosage'></div>
                    <div className='medication-frequency'></div>
                </div>
            ))}
        </div>
    )
}

export function Medications() {
    const { location } = useLocation();
    const medications = useSelector((state) => state.medications);
    const [editing, setEditing] = useState([]);
    const dispatch = useDispatch();

    const editMedication = (event, medicationId) => {
        event.preventDefault();
        const form = event.target;
        console.log('edit medication', medicationId);

        setEditing([...editing, medicationId]);

        const medication = {
            id: medicationId,
            name: form.name.value,
        };
        dispatch(update(medication))
    }

    const deleteMedication = (event, medicationId) => {
        event.preventDefault();
        console.log('delete medication', medicationId);
        dispatch(remove(medicationId))
    }
    useEffect(() => {
        console.log('Medications mounted');
        console.log(medications);
        console.log(location)
        return () => {
            console.log('Medications unmounted');
        };
    }, [medications]);

    const styles = {
        container: {
            border: '1px solid black',
            padding: '10px',
        },
    };
    return (
        <div style={styles.container}>
            <h1>Medicine Cabinet</h1>
            <p>Here you can add, remove, and edit your medications.</p>
            <MedicationsList />
            <NewMedication />
            <Table>
                <TableHead>
                    <tr>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Actions</th>
                    </tr>
                </TableHead>
                {medications.map((medication) => (
                    editing.includes(_ => _ === medication.id) ? (
                        <form onSubmit={(event) => editMedication()} key={medication.id}>
                            <TableBody>
                                <tr>
                                    <th>
                                        <input type='text' name='name' placeholder='Medication Name' />
                                    </th>
                                    <th>
                                        <input type='text' name='dosage' placeholder='Dosage' />
                                    </th>
                                    <th>
                                        <input type='text' name='frequency' placeholder='Frequency' />
                                    </th>
                                    <th>
                                        <button type='submit'>
                                            Save
                                        </button>
                                        <button type='button' onClick={(event) => deleteMedication(event, medication.id)}>
                                            Delete
                                        </button>
                                    </th>
                                </tr>
                            </TableBody>
                        </form>
                    ) : (
                        <TableBody key={medication.id}>
                            <tr>
                                <th>{medication.name}</th>
                                <th>{medication.dosage}</th>
                                <th>{medication.frequency}</th>
                                <th>
                                    <button type='button' onClick={(event) => editMedication(event, medication.id)}>
                                        Edit
                                    </button>
                                    <button type='button' onClick={(event) => deleteMedication(event, medication.id)}>
                                        Delete
                                    </button>
                                </th>
                            </tr>
                        </TableBody>
                    )))}
            </Table>
        </div>
    );
}