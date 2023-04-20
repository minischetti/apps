import React, { useEffect } from 'react';

export function App() {
    // Keep track of all timers
    const [devices, setDevices] = React.useState([]);

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