import React, { useEffect, FormEvent } from 'react';

type Medication = {
    id: string;
    name: string;
};

interface Prescription extends Medication {
    dosage: string;
    frequency: string;
    times: string[];
};

interface MedicationForm extends FormEvent<HTMLFormElement> {
    target: HTMLFormElement & {
        id: HTMLInputElement;
        name: HTMLInputElement;
    };
}


interface PrescriptionForm extends FormEvent<HTMLFormElement> {
    target: HTMLFormElement & {
        id: HTMLInputElement;
        name: HTMLInputElement;
        dosage: HTMLInputElement;
        frequency: HTMLInputElement;
    };
}


export function App() {
    const [medications, setMedications] = React.useState<Medication[]>([]);
    const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);

    const addMedication = (event: MedicationForm) => {
        event.preventDefault();
        event.stopPropagation();
        const name = event.target.name.value;


        // ID is the name lowercased and with spaces replaced with dashes
        const id = name.toLowerCase().replace(' ', '-');
        if (
            name.length === 0 ||
            name === ' ' ||
            medications.find((medication) => medication.id === id)
        ) {
            return;
        }
        setMedications([
            ...medications,
            {
                id,
                name,
            },
        ]);
    };

    const editMedication = (event: MedicationForm) => {
        event.preventDefault();
        event.stopPropagation();
        const name = event.target.name.value;
        const dosage = event.target.dosage.value;
        const frequency = event.target.frequency.value;
        // Find the medication
        // Update the medication
    };

    const addPrescription = (event: PrescriptionForm) => {
        event.preventDefault();
        event.stopPropagation();
        const name = event.target.name.value;
        const dosage = event.target.dosage.value;
        const frequency = event.target.frequency.value;
        if (prescriptions.find((prescription) => prescription.id === event.target.id.value)) {
            return;
        }
        const id = name.toLowerCase() + "-" + dosage.toLowerCase() + "-" + frequency.toLowerCase().replace(' ', '-');
        console.log(id);
        setPrescriptions([
            ...prescriptions,
            {
                id,
                name,
                dosage,
                frequency,
                times: [],
            },
        ]);
    };

    return (
        <div className='app'>
            {/* Title */}
            <h1>Medications App</h1>
            {/* My Medications */}
            <h2>My Medications</h2>
            <form onSubmit={addMedication}>
                <label htmlFor="name">Name</label>
                <input type="text" title="name" id="name" />
                <button type="submit">Add Medication</button>
            </form>
            {medications.map((medication: Medication, index) => (
                <div key={index}>
                    <h3>{medication.name}</h3>
                </div>
            ))}
            {/* My Prescriptions */}
            <h2>My Prescriptions</h2>
            <form onSubmit={addPrescription}>
                <label htmlFor="name">Medication</label>
                <select title="name" id="name">
                    {medications.map((medication: Medication, index) => (
                        <option key={index} value={medication.id}>
                            {medication.name}
                        </option>
                    ))}
                </select>
                <label htmlFor="dosage">Dosage</label>
                <input type="text" title="dosage" id="dosage" />
                <label htmlFor="frequency">Frequency</label>
                <input type="text" title="frequency" id="frequency" />
                <button type="submit">Add Prescription</button>
            </form>
            {/* Medication Schedule */}
            <h2>Prescription Schedule</h2>
            {prescriptions.map((prescription: Prescription, index) => (
                <div key={index}>
                    <h3>{prescription.name}</h3>
                    <p>Dosage: {prescription.dosage}</p>
                    <p>Frequency: {prescription.frequency}</p>
                </div>
            ))}
        </div>
    );
}