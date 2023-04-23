import React from 'react';

export function Medication({medication}) {
    return (
        <div>
            <h2>{medication.name}</h2>
            <p>{medication.dosage}</p>
            <p>{medication.frequency}</p>
            {medication.prescriptions.map((prescription) => (
                <div key={prescription.id}>
                    <h3>{prescription.name}</h3>
                    <p>{prescription.dosage}</p>
                    <p>{prescription.frequency}</p>
                </div>
            ))}
        </div>
    );
}