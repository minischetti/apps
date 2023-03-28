import React, { useEffect } from 'react';
import './App.css';
function Device({ type }) {
    const Component = types[type];
    return <Component />;
}

function Stopwatch() {
    const [time, setTime] = React.useState(0);
    const [start, setStart] = React.useState(false);

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
    };


    useEffect(() => {
        let interval = null;
        if (start) {
            interval = setInterval(() => {
                setTime((timer) => timer + 1);
            }, 1000);
        } else if (!start && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [start, time]);

    return (
        <div className='device'>
            <div className='title'>Stopwatch</div>
            <div className='time'>{time}</div>
            <button onClick={() => setStart(true)}>Start</button>
            <button onClick={() => setStart(false)}>Stop</button>
            <button onClick={() => setTime(0)}>Reset</button>
        </div>
    );
}

function Timer() {
    const [time, setTime] = React.useState(0);
    const [start, setStart] = React.useState(false);

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
    };

    useEffect(() => {
        let interval = null;
        if (start) {
            interval = setInterval(() => {
                setTime((timer) => timer + 1);
            }, 1000);
        } else if (!start && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [start, time]);

    return (
        <div className='device'>
            <div className='title'>Timer</div>
            <div className='time'>{time}</div>
            <button onClick={() => setStart(true)}>Start</button>
            <button onClick={() => setStart(false)}>Stop</button>
            <button onClick={() => setTime(0)}>Reset</button>
        </div>
    );
}

export function App() {
    // Keep track of all timers
    const [devices, setDevices] = React.useState([]);
    const types = {
        timer: Timer,
        stopwatch: Stopwatch,
    };

    const addDevice = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const type = event.target.type.value;
        setDevices([...devices, { Component: types[type] }]);
    }




    return (
        <div className='app'>
            <h1>Time Devices</h1>
            <h2>Stopwatches, timers and more...</h2>
            <h3>Add a device...</h3>
            <form onSubmit={addDevice}>
                <select name='type'>
                    <option value='timer'>Timer</option>
                    <option value='stopwatch'>Stopwatch</option>
                </select>
                <button>Add Device</button>
            </form>
            <h3>Devices</h3>
            <div className='devices'>
                {devices.map(({Component}, index) => (
                    <Component key={index} />
                ))}
            </div>
        </div>
    );
}