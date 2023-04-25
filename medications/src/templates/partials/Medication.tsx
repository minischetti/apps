import React, { useState } from 'react';

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
                <button type='button' onClick={() => setView(MedicationView.Edit)}>Edit</button>
            </div>
        </div>
        )
    }
    const AddView = () => {
        return (
        <form className="medication" onSubmit={addMedication}>
            <input type='text' name='name' placeholder='Medication Name' required />
            <input type='text' name='dosage' placeholder='Dosage' required />
            <input type='time' name='time' placeholder='Time' required />
            <button type='submit'>Add</button>
        </form>
        )
    }

    const Template = () => {
        switch(currentView) {
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