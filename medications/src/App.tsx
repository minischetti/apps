import React, { useEffect, FormEvent } from 'react';

type Medication = {
    name: string;
    dosage: string;
    frequency: string;
};

interface MedicationForm extends FormEvent<HTMLFormElement> {
    target: HTMLFormElement & {
        name: HTMLInputElement;
        dosage: HTMLInputElement;
        frequency: HTMLInputElement;
    };
}

export function App() {
    const [medications, setMedications] = React.useState<Medication[]>([]);

    const addMedication = (event: MedicationForm) => {
        event.preventDefault();
        event.stopPropagation();
        const name = event.target.name.value;
        const dosage = event.target.dosage.value;
        const frequency = event.target.frequency.value;
        setMedications([
            ...medications,
            { name, dosage, frequency },
        ]);
    };

    return (
        <div className='app'>
            {/* Title */}
            <h1>Medications App</h1>
            {/* My Medications */}
            <h2>My Medications</h2>
            {medications.map((medication: Medication, index) => (
                <div key={index}>
                    <h3>{medication.name}</h3>
                </div>
            ))}
            <h3>Add Medication</h3>
            <form onSubmit={addMedication}>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" />
                <label htmlFor="dosage">Dosage</label>
                <input type="text" name="dosage" id="dosage" />
                <label htmlFor="frequency">Frequency</label>
                <input type="text" name="frequency" id="frequency" />
                <button type="submit">Add Medication</button>
            </form>
            {/* Medication Schedule */}
            <h2>Medication Schedule</h2>
        </div>
    );
}