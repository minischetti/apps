// mock path
jest.mock('path', () => ({
    resolve: jest.fn(),
    join: jest.fn(),
    // basename: jest.fn(),
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
    copyFileSync: jest.fn(),
}));

jest.mock('child_process', () => ({
    spawn: jest.fn(),
}));

jest.mock('superagent', () => ({
    post: jest.fn(() => ({
        send: jest.fn(),
    })),
}));

import { spawn } from 'child_process';
import { readdirSync, readFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import path, { resolve } from 'path';
import superagent from 'superagent';
import { dialog } from 'electron';
import handlers from '../handlers';


describe('handlers', () => {
    it('should be an object', () => {
        expect(handlers).toBeInstanceOf(Object);
    });
    xdescribe('openFile', () => {
        beforeEach(() => {
            dialog.showOpenDialog.mockResolvedValue({
                filePaths: ['filePath'],
            });
        });
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
    describe('getVoices', () => {
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
    describe('changeVoice', () => {
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
    describe('isolate', () => {
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
    describe('chooseTrainingDirectory', () => {
        beforeEach(() => {
            readdirSync.mockReturnValueOnce(['file1', 'file2', 'file3', 'file4', 'file5']);
        });
        it('should be a function', () => {
            expect(handlers.chooseTrainingDirectory).toBeInstanceOf(Function);
        });
        it('should return a promise', () => {
            expect(handlers.chooseTrainingDirectory()).toBeInstanceOf(Promise);
        });
        it('should open a dialog', () => {
            handlers.chooseTrainingDirectory();
            expect(dialog.showOpenDialog).toHaveBeenCalled();
        });
        it('should return a directory', () => {
            handlers.chooseTrainingDirectory();
            expect(dialog.showOpenDialog).toHaveBeenCalledWith({
                properties: ['openDirectory'],
            });
        });

        it('should return if there are less than 5 files', () => {
            readdirSync.mockReturnValueOnce(['file1', 'file2', 'file3', 'file4']);
            expect(handlers.chooseTrainingDirectory()).resolves.toBeUndefined();
        });

        describe('if there are 5 or more files', () => {
            beforeEach(() => {
                readdirSync.mockReturnValueOnce(['file1', 'file2', 'file3', 'file4', 'file5']);
            });

            it('should create a dataset_raw directory', () => {
                readdirSync.mockReturnValueOnce(['file1', 'file2', 'file3', 'file4', 'file5']);
                handlers.chooseTrainingDirectory();
                expect(mkdirSync).toHaveBeenCalledWith(resolve("DIR", "dataset_raw"));
            });

            it('should create a model directory in the dataset_raw folder', () => {
                readdirSync.mockReturnValueOnce(['file1', 'file2', 'file3', 'file4', 'file5']);
                handlers.chooseTrainingDirectory();
                expect(mkdirSync).toHaveBeenCalledWith(resolve("DIR", "dataset_raw", "model"));
            });

            it('should copy the files to the dataset_raw/model directory', () => {
                readdirSync.mockReturnValueOnce(['file1', 'file2', 'file3', 'file4', 'file5']);
                handlers.chooseTrainingDirectory();
                expect(copyFileSync).toHaveBeenCalledWith(resolve("DIR", "file1"), resolve("DIR", "dataset_raw", "model", "file1"));
                expect(copyFileSync).toHaveBeenCalledWith(resolve("DIR", "file2"), resolve("DIR", "dataset_raw", "model", "file2"));
                expect(copyFileSync).toHaveBeenCalledWith(resolve("DIR", "file3"), resolve("DIR", "dataset_raw", "model", "file3"));
                expect(copyFileSync).toHaveBeenCalledWith(resolve("DIR", "file4"), resolve("DIR", "dataset_raw", "model", "file4"));
                expect(copyFileSync).toHaveBeenCalledWith(resolve("DIR", "file5"), resolve("DIR", "dataset_raw", "model", "file5"));
            });

            it('should run pre-resample', () => {
                handlers.chooseTrainingDirectory();
                expect(spawn).toHaveBeenCalledWith(
                    'svc',
                    ["pre-resample"],
                    {
                        stdio: 'inherit',
                        cwd: "DIR",
                    }
                );
            });
        });
    });
});

