import React, { useEffect, FormEvent } from 'react';
import mockMedications from './data/medications.js';
import mockUsers from './data/users.js';
import { NavLink, Route, Routes } from "react-router-dom";
import Context from './context';
import { useLocation } from 'react-router-dom';
import { Medications } from './templates/views/Medications.jsx';
import { EditMedications } from './templates/views/EditMedications.jsx';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { House, Eye, Pencil } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

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

export function Home() {
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}


export function App() {
    const [user, setUser] = React.useState(mockUsers[0]);
    const [time, setTime] = React.useState(new Date());
    const medications = useSelector((state: any) => state.medications);
    const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    // const [sidebar, setSidebar] = React.useState(
    //     [
    //         {
    //             title: 'Medications App',
    //             subtitle: 'My Medications',
    //         }

    //     ]
    // );
    // const [showSidebar, setShowSidebar] = React.useState(false);

    useEffect(() => {
        console.log(user);
        console.log(medications);
        console.log(location)
        // timer
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => {
            clearInterval(interval);
        }
    }, [user, medications, location]);

    // const handleShowSidebar = (event: FormEvent<HTMLButtonElement>) => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     console.log('showSidebar', showSidebar)
    //     setShowSidebar(!showSidebar);
    // };

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

    const navigateTo = (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const location = event.currentTarget.getAttribute('data-location');
        console.log(location);
        navigate(location);
    };

    const styles = {
        container: {
            flex: 1,
            // flexDirection: 'row',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        // sidebar: {
        //     position: 'absolute',
        //     flex: 1,
        //     backgroundColor: '#fff',
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //     // box
        //     boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.5)',
        // },
        modal: {
            position: 'absolute',
        }
    };

    const locations = [
        {
            pathname: '/',
            title: 'Home',
        },
        {
            pathname: '/medications',
            title: 'View Medications',
        },
        {
            pathname: '/medications/edit',
            title: 'Edit Medications',
        },
    ];

    return (
        <div className='app' style={styles.container}>
            <BottomNavigation
                showLabels
            >
                <BottomNavigationAction label="Home" icon={<House />} data-location="/" onClick={navigateTo} />
                <BottomNavigationAction label="View" icon={<Eye />} data-location="/medications" onClick={navigateTo} />
                <BottomNavigationAction label="Edit" icon={<Pencil />} data-location="/medications/edit" onClick={navigateTo} />
            </BottomNavigation>
            <Routes>
                <Route
                    path="*"
                    element={<Home />}
                />
                <Route
                    path="medications"
                >
                    <Route
                        index={true}
                        element={<Medications />}
                    />
                    <Route
                        path="edit"
                        element={<EditMedications />}
                    />
                </Route>
            </Routes>
        </div>
    );
}