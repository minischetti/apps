import React, { useState } from 'react';

enum MedicationView {
    Default = 'default',
    Edit = 'edit',
    Add = 'add'
}

export function Medication({medication = {}, view = MedicationView.Default, addMedication, updateMedication, deleteMedication}) {
    const EditView = () => {
        return (
            <form className="medication">
                <input type='text' name='name' placeholder='Medication Name' defaultValue={medication.name} />
                <input type='text' name='dosage' placeholder='Dosage' defaultValue={medication.dosage} />
                <input type='time' name='time' placeholder='Time' defaultValue={medication.time} />
                <button type='button' onClick={(event) => updateMedication(event, medication.id)}>Update</button>
                <button type='button' onClick={(event) => deleteMedication(event, medication.id)}>Delete</button>
                <input type='hidden' name='id' value={medication.id} />
            </form>
        )
    }
    const DefaultView = () => {
        return (
        <div>
            <div className='medication'>
                <h2>{medication.name}</h2>
                <p>{medication.dosage}</p>
                <p>{medication.time}</p>
            </div>
        </div>
        )
    }
    const AddView = () => {
        return (
        <form className="medication">
            <input type='text' name='name' placeholder='Medication Name' />
            <input type='text' name='dosage' placeholder='Dosage' />
            <input type='time' name='time' placeholder='Time' />
            <button type='submit' onClick={addMedication}>Add</button>
        </form>
        )
    }

    const Template = () => {
        switch(view) {
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