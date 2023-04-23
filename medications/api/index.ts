'use strict';

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
        path: '/api/medications',
        handler: (request, h) => {
            console.log('GET /medications');
            return 'Hello, world!';
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