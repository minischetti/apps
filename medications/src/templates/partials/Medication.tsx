import { Eraser, FloppyDisk, Pencil } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { Modal } from './Modal';

enum MedicationView {
    Default = 'default',
    Edit = 'edit',
    Add = 'add'
}

type Medication = {
    id: number,
    name: string,
    dosage: string,
    time: string
}

export function Medication({medication = {}, view = MedicationView.Default, addMedication, updateMedication, deleteMedication}) {
    const [currentView, setView] = useState(view);

    const handleUpdateMedication = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event);
        updateMedication(event);
        setView(MedicationView.Default);
    }

    const handleCloseModal = () => {
        setView(MedicationView.Default);
    }
    const EditView = () => {
        return (
            <form className="medication" onSubmit={handleUpdateMedication}>
                <input type='text' name='name' placeholder='Medication Name' defaultValue={medication.name} />
                <label htmlFor='dosage'>Dosage</label>
                <input type='text' name='dosage' placeholder='Dosage' defaultValue={medication.dosage} />
                <label htmlFor='time'>Time</label>
                <input type='time' name='time' placeholder='Time' defaultValue={medication.time} />
                <div className="button-container">
                    <button type='submit'>Update</button>
                    <button type='button' onClick={(event) => deleteMedication(event, medication.id)}>Delete</button>
                    <button type='button' onClick={() => setView(MedicationView.Default)}>Cancel</button>
                </div>
                <input type='hidden' name='id' value={medication.id} />
            </form>
        )
    }
    const DefaultView = () => {
        return (
            <div className='medication' data-id={medication.id}>
                <h3>{medication.name}</h3>
                <Pencil onClick={() => setView(MedicationView.Edit)} />
            </div>
        )
    }
    const AddView = () => {
        return (
            <form className="medication" onSubmit={addMedication}>
                <label htmlFor='name'>Name</label>
                <input type='text' name='name' placeholder='Name' required />                
                <button type='submit'>Save</button>
            </form>
        )
    }

    const Template = () => {
        switch (currentView) {
            case MedicationView.Edit:
                return <EditView />
            case MedicationView.Add:
                return <AddView />
            case MedicationView.Default:
            default:
                return <DefaultView />
        }
    }

    return (
        <div>
            <Template />
        </div>
    )
}