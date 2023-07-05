import helpers from '../helpers';

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

import {readdirSync, readFileSync, existsSync, mkdirSync, copyFileSync} from 'fs';

describe('helpers', () => {
    it('should be an object', () => {
        expect(helpers).toBeInstanceOf(Object);
    });
    describe('createDirectoryIfNotExists', () => {
        it('should be a function', () => {
            expect(helpers.createDirectoryIfNotExists).toBeInstanceOf(Function);
        });
        describe('when the directory does not exist', () => {
            it('should create the directory', () => {
                existsSync.mockReturnValueOnce(false);
                helpers.createDirectoryIfNotExists('path');
                expect(mkdirSync).toHaveBeenCalled();
            });
        });
        describe('when the directory exists', () => {
            it('should not create the directory', () => {
                existsSync.mockReturnValueOnce(true);
                helpers.createDirectoryIfNotExists('path');
                expect(mkdirSync).not.toHaveBeenCalled();
            });
        });
    });
    describe('copyFiles', () => {
        it('should be a function', () => {
            expect(helpers.copyFiles).toBeInstanceOf(Function);
        });
        it('should copy files from source to destination', () => {
            readdirSync.mockReturnValueOnce(['file1', 'file2']);
            helpers.copyFiles('source', 'destination');
            expect(copyFileSync).toHaveBeenCalledTimes(2);
        });
    });
});