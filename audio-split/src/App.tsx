import React, { useEffect, FormEvent } from 'react';

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

export function App() {
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
            <div>Song Splitter</div>
        </div>
    );
}