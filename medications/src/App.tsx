import React, { useEffect, FormEvent } from 'react';
import mockUsers from './data/users.js';
import { NavLink, Route, Routes } from "react-router-dom";
import { useLocation, Outlet } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { House, Eye, Pencil } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search } from './templates/partials/Search.jsx';
import { Modal } from './templates/partials/Modal.jsx';

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
    // use react router outlet

    const [user, setUser] = React.useState(mockUsers[0]);
    const [time, setTime] = React.useState(new Date());
    const medications = useSelector((state: any) => state.medications);
    const modal = useSelector((state: any) => state.modal);
    const location = useLocation();
    const navigate = useNavigate();

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

    const styles = {
        container: {
            flex: 1,
            flexDirection: 'column',
            gap: "1rem",
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modal: {
            position: 'absolute',
        }
    };

    const locations = [
        {
            pathname: '/',
            title: 'Home',
            icon: <House />,
        },
        {
            pathname: '/medications',
            title: 'Medications',
            icon: <Eye />,
        },
        {
            pathname: '/regiments',
            title: 'Regiments',
            icon: <Pencil />,
        },
    ];

    return (
        <div style={styles.container}>
            <BottomNavigation
                showLabels
            >
                {locations.map((location, index) => (
                    <BottomNavigationAction key={index} component={NavLink} label={location.title} icon={location.icon} to={location.pathname} />
                ))}
            </BottomNavigation>
            <Search />
            {modal.open ? 
                <Modal content={<div>Hello there!</div>} />
            : null}
            <Outlet />
        </div>
    );
}