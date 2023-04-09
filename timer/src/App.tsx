import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import deviceSlice, { add } from './state/slices/deviceSlice';
import { Box, Clock, Text } from 'grommet';

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

function AddDevice() {
    const [hours, setHours] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(0);
    const [direction, setDirection] = React.useState(Direction.Up);
    const dispatch = useDispatch();
    const devices = useSelector((state) => state.devices);

    const handleHoursChange = (event) => {
        if (event.target.value === '') {
            setHours(0);
            return;
        }
        const number = parseInt(event.target.value);
        setHours(number);
    };

    const handleMinutesChange = (event) => {
        if (event.target.value === '') {
            setMinutes(0);
            return;
        }
        const number = parseInt(event.target.value);
        setMinutes(number);
    };

    const handleSecondsChange = (event) => {
        if (event.target.value === '') {
            setSeconds(0);
            return;
        }
        const number = parseInt(event.target.value);
        setSeconds(number);
    };

    const AddDevice = (event) => {
        event.preventDefault();
        const duration = event.target.duration.value;
        const direction = event.target.direction.value;

        dispatch(
            add(
                { duration, direction }
            )
        );
    };

    return (
        <form onSubmit={AddDevice}>
            <Stack spacing={2} alignContent={'center'}>
                <TextField id="outlined-basic" label="Hours" variant="outlined" name='hours' title='Hours' value={hours} onChange={handleHoursChange} type='number' />
                <Slider aria-label="Duration" value={hours} onChange={handleHoursChange} />

                <TextField id="outlined-basic" label="Minutes" variant="outlined" name='minutes' title='Minutes' value={minutes} onChange={handleMinutesChange} type='number' />
                <Slider aria-label="Minutes" value={minutes} onChange={handleMinutesChange} />

                <TextField id="outlined-basic" label="Seconds" variant="outlined" name='seconds' title='Seconds' value={seconds} onChange={handleSecondsChange} type='number' />
                <Slider aria-label="Seconds" value={seconds} onChange={handleSecondsChange} />
            </Stack>
            <select name='direction' title='Count Direction'>
                <option value={Direction.Up}>Up</option>
                <option value={Direction.Down}>Down</option>
            </select>
            <button type="submit">Add Device</button>
        </form>
    );
}

export function App() {
    const devices = useSelector((state) => state.devices);
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(add({ type: 'timer' }));
        console.log(devices);
    }, []);

    return (
        <div className='app'>
            <h1>Time Keeper</h1>
            <AddDevice />
            <h3>Devices</h3>
            <div className='devices'>
            </div>
        </div>
    );
}