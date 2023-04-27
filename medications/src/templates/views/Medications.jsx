import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from '../../store/medicationsSlice';
import { Medication } from '../partials/Medication';
import { Eye, ListPlus, Pencil } from 'phosphor-react';
import { Modal } from '../partials/Modal';

export function Medications() {
    const medications = useSelector((state) => state.medications);
    const regiments = useSelector((state) => state.regiments);
    const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
    const [showAddMedicationForm, setShowAddMedicationForm] = useState(false);
    const dispatch = useDispatch();
    const [viewMode, setViewMode] = useState('default');

    useEffect(() => {
        console.log('medications', medications);
        console.log('regiments', regiments);
    }, [medications, regiments, viewMode]);

    const handleFormSubmit = (event, type) => {
        event.preventDefault();
        const form = event.target;

        if (type === 'add') {
            addMedication(event);
        } else if (type === 'edit') {
            updateMedication(event);
        } else if (type === 'delete') {
            deleteMedication(event, form.id.value);
        }
    }

    const addMedication = (event) => {
        event.preventDefault();
        console.log(event);
        const form = event.target;
        console.log(form);

        // TODO: Add custom validations
        // // check if medication already exists
        // if (medications.find((medication) => medication.name === form.name.value)) {
        //     alert('Medication already exists.');
        //     return;
        // }

        const medication = {
            id: medications.length + 1,
            name: form.name.value,
            // dosage: form.dosage.value,
            // time: form.time.value,
        };
        dispatch(add(medication))
        setShowAddMedicationForm(false);
        setShowAddMedicationModal(false);
    }

    const updateMedication = (event) => {
        event.preventDefault();
        const form = event.target;
        console.log('edit medication', form.id.value);

        const medication = {
            id: form.id.value,
            name: form.name.value,
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
            <form onSubmit={(event) => handleFormSubmit(event, 'add')}>
                {/* <label htmlFor='name'>Name</label> */}
                <input type='text' id='name' name='name' placeholder='Name' required />
                <button type='submit'>Add Medication</button>
            </form>
            {/* View mode toggle radio */}
            <div className='medications'>
                {medications.map((medication) => {
                    return (
                        <Medication
                            key={medication.id}
                            medication={medication}
                            view={viewMode}
                            addMedication={addMedication}
                            updateMedication={updateMedication}
                            deleteMedication={deleteMedication}
                        />
                    );
                })}
            </div>
        </div>
    );
}