import { handlers } from '../handlers';
// mock path
jest.mock('path', () => ({
    resolve: jest.fn(),
    join: jest.fn(),
    basename: jest.fn(),
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
}));

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
    });
}
);


