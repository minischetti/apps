import React, { useEffect } from 'react';
import data from './data/cards';

export function App() {
    const [timer, setTimer] = React.useState(0);
    const [start, setStart] = React.useState(false);

    useEffect(() => {
        let interval = null;
        if (start) {
            interval = setInterval(() => {
                setTimer((timer) => timer + 1);
            }, 1000);
        } else if (!start && timer !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [start, timer]);

    return (
        <div className='app'>
            <h1>Timer</h1>
            <div className='timer'>{timer}</div>
            <button onClick={() => setStart(true)}>Start</button>
            <button onClick={() => setStart(false)}>Stop</button>
        </div>
    );
}