import handlers from '../handlers';
// mock path
jest.mock('path', () => ({
    resolve: jest.fn(),
    join: jest.fn(),
    basename: jest.fn(),
    // extname: jest.fn(),
    ...jest.requireActual('path'),
}));

jest.mock('electron', () => ({
    dialog: {
        showOpenDialog: jest.fn(),
    },
    BrowserWindow: jest.fn(),
    Menu: jest.fn(),
    app: {
        on: jest.fn(),

    },
    ipcMain: {
        on: jest.fn(),
    },
}));

jest.mock('music-metadata', () => ({
    parseFile: jest.fn(() => ({
        common: {
            title: 'title',
            artist: 'artist',
            album: 'album',
            year: 'year',
            track: {
                no: 1,
                of: 1,
            },
            genre: 'genre',
            picture: [
                {
                    data: 'data',
                },
            ],
        },
    })),

    selectCover: jest.fn(),
}));

jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    readdirSync: jest.fn(),
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
}));

jest.mock('child_process', () => ({
    spawn: jest.fn(),
}));

jest.mock('superagent', () => ({
    post: jest.fn(() => ({
        send: jest.fn(),
    })),
}));

import {spawn} from 'child_process';
import {readdirSync, readFileSync} from 'fs';
import path, { resolve } from 'path';
import superagent from 'superagent';

describe('Main', () => {
    it('should be true', () => {
        expect(true).toBe(true);
    });
}
);

describe('Main', () => {
    describe('handlers', () => {
        it('should be an object', () => {
            expect(handlers).toBeInstanceOf(Object);
        });
        describe('handlers.openFile', () => {
            it('should be a function', () => {
                expect(handlers.openFile).toBeInstanceOf(Function);
            });
            it('should return a promise', () => {
                expect(handlers.openFile()).toBeInstanceOf(Promise);
            });
            it('should return a file object', () => {
                expect(handlers.openFile("event", "filePath")).resolves.toBeInstanceOf(Object);
            });
            it('should return a file object with a name property', () => {
                expect(handlers.openFile("event", "filePath")).resolves.toHaveProperty('name');
            });
            it('should return a file object with a path property', () => {
                expect(handlers.openFile("event", "filePath")).resolves.toHaveProperty('path');
            });
            it('should return a file object with a file property', () => {
                expect(handlers.openFile("event", "filePath")).resolves.toHaveProperty('file');
            });
            it('should return a file object with a metadata property', () => {
                expect(handlers.openFile("event", "filePath")).resolves.toHaveProperty('metadata');
            });
            it('should return a file object with a metadata property with a cover property', () => {
                expect(handlers.openFile("event", "filePath")).resolves.toHaveProperty('metadata.cover');
            });
        });
        describe('handlers.getVoices', () => {
            it('should be a function', () => {
                expect(handlers.getVoices).toBeInstanceOf(Function);
            });
            it('should return a promise', () => {
                expect(handlers.getVoices()).toBeInstanceOf(Promise);
            });
            it('should return an array', () => {
                readdirSync.mockReturnValueOnce(['model1', 'model2']);
                expect(handlers.getVoices()).resolves.toBeInstanceOf(Array);
            });
        });
        describe('handlers.changeVoice', () => {
            const model_data = 'model.pth';
            const model_config = 'config.json';
            const voice = 'model1';
            const filePath = 'path/to/file.wav';
            beforeEach(() => {
                readdirSync.mockReturnValueOnce(['model1', 'model2']);
                readdirSync.mockReturnValueOnce([model_config, model_data]);
            });
            it('should be a function', () => {
                expect(handlers.changeVoice).toBeInstanceOf(Function);
            });
            it('should return a promise', () => {
                expect(handlers.changeVoice('event', 'filePath', 'model1')).toBeInstanceOf(Promise);
            });
            it('should call svc', () => {
                handlers.changeVoice('event', filePath, 'model1');
                expect(spawn).toHaveBeenCalled();
                // TODO: Check for these with finer-grained tests for flexibility
                expect(spawn).toHaveBeenCalledWith(
                    'svc',
                    ["infer", "--no-auto-predict-f0", "--f0-method", "crepe", "--db-thresh", "-50", "-m", model_data, "-c", model_config, "-o", + voice + ".wav", filePath],
                    {
                        stdio: 'inherit',
                    }
                    );
            });
        });
        describe('handlers.isolate', () => {
            it('should be a function', () => {
                expect(handlers.isolate).toBeInstanceOf(Function);
            });
            it('should return a promise', () => {
                expect(handlers.isolate()).toBeInstanceOf(Promise);
            });
            it('should make a post request to the isolate endpoint', () => {
                handlers.isolate();
                expect(superagent.post).toHaveBeenCalledWith('http://127.0.0.1:8000/api/isolate/');
            });
        });
    });
}
);


