import { Eraser, FloppyDisk, Pencil } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { Modal } from './Modal';
import { ArrowDown } from 'phosphor-react';

enum MedicationView {
    Default = 'default',
    Edit = 'edit',
    Add = 'add'
}

enum MedicationTime {
    Specific = 'specific',
    Awakening = 'awakening',
    Morning = 'morning',
    Afternoon = 'afternoon',
    Evening = 'evening',
    Night = 'night',
    Bedtime = 'bedtime',
}

type Medication = {
    id: number,
    name: string,
    dosage: string,
    time: string
}

export function Medication({ medication = {}, view = MedicationView.Default, addMedication, updateMedication, deleteMedication }) {
    const [currentView, setView] = useState(view);
    const [specificTime, setSpecificTime] = useState(false);
    const [time, setTime] = useState(MedicationTime.Specific);

    const handleUpdateMedication = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event);
        updateMedication(event);
        setView(MedicationView.Default);
    }

    const handleCloseModal = () => {
        setView(MedicationView.Default);
    }

    const medicationTimeOptions = {
        [MedicationTime.Specific]: 'I\'ll choose a specific time',
        [MedicationTime.Awakening]: 'Upon awakening',
        [MedicationTime.Morning]: 'Morning',
        [MedicationTime.Afternoon]: 'Afternoon',
        [MedicationTime.Evening]: 'Evening',
        [MedicationTime.Night]: 'Night',
        [MedicationTime.Bedtime]: 'Bedtime',
    }


    const EditView = () => {
        return (
            <form className="medication" onSubmit={handleUpdateMedication}>
                <label htmlFor='name'>Name</label>
                <input type='text' name='name' placeholder='Name' defaultValue={medication.name} />
                <label htmlFor='dosage'>Dosage</label>
                <input type='text' name='dosage' placeholder='Dosage' defaultValue={medication.dosage} />
                {/* <label htmlFor='when'>When</label> */}
                {/* Select with options for awakening and bedtime */}
                {/* <select name='when' defaultValue={medication.when}>
                    {Object.entries(medicationTimeOptions).map(([key, value]) => {
                        return <option key={key} value={key}>{value}</option>
                    })}
                </select> */}
                <label htmlFor='time'>Time</label>
                <input type='time' name='time' defaultValue={medication.time} />
                {/* Checkmark for food */}
                {/* <label htmlFor='food'>Take this with food?</label> */}
                {/* <input type='checkbox' name='food' defaultChecked={medication.food} /> */}
                {/* Special notes */}
                <label htmlFor='notes'>Notes</label>
                <textarea name='notes' placeholder='Notes' defaultValue={medication.notes} />
                <div className="button-container">
                    <button type='button' onClick={() => setView(MedicationView.Default)}>Back</button>
                    <button type='button' onClick={(event) => deleteMedication(event, medication.id)}>Delete</button>
                    <button type='submit'>Save</button>
                </div>
                <input type='hidden' name='id' value={medication.id} />
            </form>
        )
    }
    const DefaultView = () => {
        const [showContent, setShowContent] = useState(false);
        return (
            <div className='medication' data-id={medication.id}>
                <header>
                    <h3>{medication.name}</h3>
                    <div className="button-container">
                        <div className='button button-icon' onClick={() => setView(MedicationView.Edit)}>Add Details<Pencil /></div>
                        <div className='button button-icon' onClick={(event) => setShowContent(!showContent)}>See Details<ArrowDown /></div>
                    </div>
                </header>
                {showContent && (
                    <div>
                        {medication.dosage && <p>{medication.dosage}</p>}
                        {/* {medication.when && <p>{medicationTimeOptions[medication.when]}</p>} */}
                        {medication.time && <p>{medication.time}</p>}
                        {medication.food && <p>Take with food</p>}
                        {medication.notes && <p>{medication.notes}</p>}
                    </div>
                )}
                {/* Accordion */}
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