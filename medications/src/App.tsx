import React, { useEffect, FormEvent } from 'react';
import mockMedications from './data/medications.js';
import mockUsers from './data/users.js';

type Dosage = {
    time: string;
    amount: string;
};

type Medication = {
    id: string;
    name: string;
};

interface Prescription extends Medication {
    dosage: string;
    frequency: string[];
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

function EditMedications({ medications, editMedication }) {
    return (
        <div className='medications'>
            <div className='title'>Medications</div>
            <div className='medications-list'>
                {medications.map((medication) => (
                    <div className='medication' key={medication.id}>
                        <div className='medication-name'>{medication.name}</div>
                        <div className='medication-dosage'>Dosage: </div>
                        <div className='medication-frequency'>Frequency: </div>
                        <button type='button' onClick={editMedication}>
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Medications({ medications, addMedication, editMedication }) {
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
        <div className='medications'>
            <div className='title'>Medications</div>
            <div style={styles.pills}>
                {medications.map((medication) => (
                    <div style={styles.pill} key={medication.id}>
                        <div className='medication-name'>{medication.name}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={addMedication}>
                <input type='text' name='name' placeholder='Medication Name' />
                <button type='submit'>Add Medication</button>
            </form>
        </div>
    );
}


export function App() {
    const [user, setUser] = React.useState(mockUsers[0]);
    const [medications, setMedications] = React.useState<Medication[]>(mockMedications);
    const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
    const [sidebar, setSidebar] = React.useState(
        [
            {
                title: 'Medications App',
                subtitle: 'My Medications',
            }

        ]
    );
    const [showSidebar, setShowSidebar] = React.useState(false);

    useEffect(() => {
        console.log(user);
        console.log(medications);
    }, [user, medications]);

    const handleShowSidebar = (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('showSidebar', showSidebar)
        setShowSidebar(!showSidebar);
    };

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
        const medication = medications.find((medication) => medication.id === event.target.id.value);
        // Update the medication
        if (medication) {
            medication.name = name;
            medication.dosage = dosage;
            medication.frequency = frequency;
        }
        // Update the state
        setMedications([...medications]);
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
            },
        ]);
    };

    const locations = [
        {
            title: 'Medications',
            content: <Medications medications={medications} addMedication={addMedication} editMedication={editMedication} />,
        },
        {
            title: 'Prescriptions',
        },
    ]

    const styles = {
        container: {
            flex: 1,
            // flexDirection: 'row',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        sidebar: {
            position: 'absolute',
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            // box
            boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.5)',
        },
    };

    return (
        <div className='app' style={styles.container}>
            {/* Sidebar */}
            <div onClick={handleShowSidebar}>Show Sidebar</div>
            {showSidebar ? <div style={styles.sidebar}>
                {locations.map((item, index) => (
                    <div key={index}>
                        <h1>{item.title}</h1>
                        {item.content}
                    </div>
                ))}
            </div> : null}
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
                    <form onSubmit={editMedication}>
                        <input type="hidden" title="id" id="id" value={medication.id} />
                        <label htmlFor="name">Name</label>
                        <input type="text" title="name" id="name" defaultValue={medication.name} />
                        <label htmlFor="dosage">Dosage</label>
                        <input type="text" title="dosage" id="dosage" defaultValue={medication.dosage} />
                        <label htmlFor="frequency">Frequency</label>
                        <input type="text" title="frequency" id="frequency" defaultValue={medication.frequency} />
                        <button type="submit">Edit Medication</button>
                    </form>
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