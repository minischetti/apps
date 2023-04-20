import Context from "../../context";
import React, { useContext } from "react";

export function EditMedications() {
    const { medications, editMedication } = useContext(Context);

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