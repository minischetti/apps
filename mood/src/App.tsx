import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, { useEffect, FormEvent } from 'react';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';


const Mood = {
    Up: 'up',
    Neutral: 'neutral',
    Down: 'down',
};

interface MoodForm extends FormEvent<HTMLFormElement> {
    target: HTMLFormElement & {
        id: HTMLInputElement;
        name: HTMLInputElement;
    };
}

export function App() {
    // Keep track of all timers
    const [logs, setLogs] = React.useState([]);
    const [mood, setMood] = React.useState('neutral');

    const logMood = (event: MoodForm) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(mood);
        const time = new Date().toLocaleTimeString();
        setLogs([
            ...logs,
            {
                mood,
                time,
            },
        ]);

        // Save the logs to the local storage
        localStorage.setItem('logs', JSON.stringify(logs));
    }


    useEffect(() => {
        // Get the logs from the local storage
        const logs = JSON.parse(localStorage.getItem('logs'));
        if (logs) {
            setLogs(logs);
        }
    }, []);

    return (
        <div className='app'>
            <h1>Mood Module</h1>
            <h3>Log your mood...</h3>
            <form onSubmit={logMood}>
                <ToggleButtonGroup
                    orientation="vertical"
                    value={mood}
                    exclusive
                    onChange={(event, newMood) => {
                        setMood(newMood);
                    }}
                >
                    <ToggleButton value={Mood.Up} aria-label="up">
                        Up
                    </ToggleButton>
                    <ToggleButton value={Mood.Neutral} aria-label="neutral">
                        Neutral
                    </ToggleButton>
                    <ToggleButton value={Mood.Down} aria-label="down">
                        Down
                    </ToggleButton>
                </ToggleButtonGroup>
                <Button type='submit' variant='contained'>
                    Log
                </Button>
            </form>

            <h3>Logs</h3>
            <div className='logs'>
                {logs.map((log, index) => (
                    <div key={index} className='log'>
                        <div className='log__mood'>{log.mood}</div>
                        <div className='log__time'>{log.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}