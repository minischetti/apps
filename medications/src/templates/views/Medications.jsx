import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from '../../store/medicationsSlice';
import { set } from '../../store/modalSlice.js';
import { Alarm } from '@phosphor-icons/react';
import { Medication } from '../partials/Medication';
import { Table, TableBody, TableHead } from '@mui/material';

export function Medications() {
    const medications = useSelector((state) => state.medications);
    const regiments = useSelector((state) => state.regiments);
    const dispatch = useDispatch();

    const handleFormSubmit = (event, type) => {
        event.preventDefault();
        const form = event.target;

        if (type === 'add') {
            addMedication(event);
        } else if (type === 'edit') {
            editMedication(event);
        } else if (type === 'delete') {
            deleteMedication(event, form.id.value);
        }
    }

    const addMedication = (event) => {
        event.preventDefault();
        console.log(event);
        const form = event.target;


        // // check if medication already exists
        // if (medications.find((medication) => medication.name === form.name.value)) {
        //     alert('Medication already exists.');
        //     return;
        // }

        const medication = {
            id: medications.length + 1,
            name: form.name.value,
        };
        dispatch(add(medication))
    }

    const editMedication = (event) => {
        event.preventDefault();
        const form = event.target;
        console.log('edit medication', form.id.value);

        const medication = {
            id: form.id.value,
            name: form.name.value,
            dosage: form.dosage.value,
            time: form.time.value,
        };
        console.log('medication', medication);
        dispatch(update(medication))
    }

    const deleteMedication = (event, medicationId) => {
        event.preventDefault();
        console.log('delete medication', medicationId);
        dispatch(remove(medicationId))
    }
    useEffect(() => {
        console.log('Medications mounted');
        console.log("regiments", regiments);
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
            {/* <MedicationsList /> */}
            {/* <NewMedication /> */}
            {/* FIXME */}
            <form onChange={editMedication}>
                <Table>
                    <TableHead>
                        <tr>
                            <th>Medication</th>
                            <th>Dosage</th>
                            <th>Time</th>
                            <th>Actions</th>
                            <th><button onClick={addMedication}>Add</button> </th>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {medications.map((medication) => (
                            <tr key={medication.id}>
                                <th>
                                    <input type='text' name='name' placeholder='Medication Name' defaultValue={medication.name} />
                                </th>
                                <th>
                                    <input type='text' name='dosage' placeholder='Dosage' defaultValue={medication.dosage} />
                                </th>
                                <th>
                                    <input type='time' name='time' placeholder='Time' defaultValue={medication.time} />
                                    {/* regiments */}
                                    {/* {regiments.filter((regiment) => regiment.medicationId === medication.id).length > 0 ? (
                                        
                                        regiments.map((regiment) => (
                                            regiment.times.length > 0 ? regiment.times.map((time) => (
                                                <Alarm />
                                            )) : null
                                        ))
                                    ) : (
                                        "No times set"
                                    )} */}
                                </th>
                                <th>
                                    <button type='button' onClick={(event) => deleteMedication(event, medication.id)}>
                                        Delete
                                    </button>
                                    <input type='hidden' name='id' value={medication.id} />
                                </th>
                            </tr>
                        ))}
                    </TableBody>
                </Table>
            </form>
        </div>
    );
}