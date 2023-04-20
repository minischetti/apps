import React, { useEffect } from 'react';

const types = {
    timer: Timer,
};

function Device({ type }) {
    const Component = types[type];
    return <Component />;
}

const Direction = {
    Up: 'up',
    Down: 'down',
};



function Timer(duration: number, direction: typeof Direction) {
    const [time, setTime] = React.useState(0);
    const [start, setStart] = React.useState(false);
    // Laps
    // Alarm
    // Overlap-able

    const [alarm, setAlarm] = React.useState(false);
    const [sound, setSound] = React.useState(false);
    // Time when surpassed duration


    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
    };


    useEffect(() => {
        let interval = 0;
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
            <div className='count-type'>Count Type: {direction}</div>
            <div className='time'>{time}</div>
            <button type="button" onClick={() => setStart(true)}>Start</button>
            <button type="button" onClick={() => setStart(false)}>Stop</button>
            <button type="button" onClick={() => setTime(0)}>Reset</button>
        </div>
    );
}

export function App() {
    // Keep track of all timers
    const [devices, setDevices] = React.useState([]);

    const addDevice = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        const direction = event.target.direction.value;
        setDevices([...devices, () => Timer(0, direction)]);
    }




    return (
        <div className='app'>
            <h1>Time Devices</h1>
            <h3>Add a device...</h3>
            <form onSubmit={addDevice}>
                <select name='direction' title='Count Direction'>
                    <option value={Direction.Up}>Up</option>
                    <option value={Direction.Down}>Down</option>
                </select>
                <button type="button">Add Device</button>
            </form>
            <h3>Devices</h3>
            <div className='devices'>
                {devices.map((Device, index) => (
                    <Device key={index} />
                ))}
            </div>
        </div>
    );
}