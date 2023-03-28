import React, { useEffect } from 'react';

function Timer() {
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
        <div className='timer'>
            <div className='timer__time'>{timer}</div>
            <button onClick={() => setStart(true)}>Start</button>
            <button onClick={() => setStart(false)}>Stop</button>
        </div>
    );
}


export function App() {
    // Keep track of all timers
    const [timers, setTimers] = React.useState([]);


    const addTimer = () => {
        setTimers([...timers, 0]);
    };



    return (
        <div className='app'>
            <h1>Timers</h1>
            <button onClick={addTimer}>Add Timer</button>
            <div className='timers'>
                {timers.map((timer, index) => (
                    <Timer key={index} />
                ))}
            </div>
        </div>
    );
}