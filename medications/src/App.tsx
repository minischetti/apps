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
import { Timeline } from './templates/partials/Timeline.js';
import { Calendar } from 'phosphor-react';

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

function App() {
    // use react router outlet

    const [user, setUser] = React.useState(mockUsers[0]);
    const medications = useSelector((state: any) => state.medications);
    const modal = useSelector((state: any) => state.modal);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [showSidebar, setShowSidebar] = React.useState(false);

    useEffect(() => {
        console.log(user);
        console.log(medications);
        console.log(location)
        // timer
        const interval = setInterval(() => setCurrentDate(new Date()), 1000);
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
        {
            pathname: '/schedule',
            title: 'Schedule',
            icon: <Calendar />,
        },
    ];

    return (
        <div className='app'>
            <div className="header">
                {/* <button onClick={() => setShowSidebar(!showSidebar)}>Menu</button> */}
                {/* <h1>{currentDate.toLocaleDateString('en-US', { month: 'long' })} {currentDate.toLocaleDateString('en-US', { day: 'numeric' })}, {currentDate.toLocaleDateString('en-US', { year: 'numeric' })}</h1> */}
                {/* Fake weather */}
                <div className="row container">

                    <h2>Rx Tracker</h2>
                    {locations.map((location, index) => (
                        <NavLink className="drawer--link" key={index} to={location.pathname}>
                            {location.title}
                        </NavLink>
                    ))}
                </div>
                {/* <h2>72°</h2> */}
                <div className="avatar">
                    <h2>{user.name}</h2>
                    {/* <img src={user.avatar} alt={user.name} /> */}
                </div>
            </div>
            {/* {showSidebar && ( */}
            <div className="content">
                {/* <Search /> */}
                <div className="body">
                    <Outlet />
                </div>
            </div>
            {/* )} */}

        </div>
    );
}

export default App;