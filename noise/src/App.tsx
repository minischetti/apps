import React, { useEffect, FormEvent, useState } from 'react';


export function App() {
    const [noise, setNoise] = useState<boolean>(false);
    const [context, setContext] = useState<AudioContext | null>(null);

    const toggleNoise = () => {
        if (!context) {
            createContext();
        } else {
            context.resume();
        }
        setNoise(!noise);
        whiteNoise();
    };

    const createContext = () => {
        setContext(new AudioContext());
    };

    const WhiteNoiseProcessor = () => {
        if (!context) {
            return;
        }
        const bufferSize = 4096;
        const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = context.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(0);
        whiteNoise.connect(context.destination);
    };


    const whiteNoise = () => {
        if (!context) {
            return;
        }
        // Create white noise and play it.
    
        const bufferSize = 4096;
        const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = context.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(0);
        whiteNoise.connect(context.destination);
    };

    const styles = {
        container: {
            flex: 1,
            // flexDirection: 'row',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        sidebar: {
            position: 'absolute',
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            // box
            boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.5)',
        },
    };

    return (
        <div className='app' style={styles.container}>
            <div>Noisy Neighbor</div>
            <button onClick={toggleNoise}>{noise ? "Enabled" : "Disabled"}</button>
            <div></div>
        </div>
    );
}