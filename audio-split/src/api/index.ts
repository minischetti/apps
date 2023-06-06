'use strict';
// const fs = require('fs');
// const path = require('path');
const { exec } = require('child_process');
// const { spawn } = require('child_process');
const execSync = require('child_process').execSync;
// const hello = require('./Hello.mp3');
const promisify = require('util').promisify;
const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            console.log('GET /');
            return 'Hello, world!';
        }
    });

    server.route({
        method: 'GET',
        path: '/api/split',
        handler: (request, h) => {
            // Spawn a child process to run the audio-splitter script
            // const child = exec('anaconda');
            // Check if ffmpeg is installed
            let result;
            try {
                result = execSync('ffmpeg -version');
            }
            catch (err) {
                console.log('ffmpeg is not installed');
                return 'ffmpeg is not installed';
            }
            console.log('ffmpeg is installed');
            return 'ffmpeg is installed';
        }
    });

    server.route({
        method: 'POST',
        path: '/api/medications',
        handler: (request, h) => {
            console.log('POST /medications');
            return 'Hello, world!';
        }
    });
};


process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();