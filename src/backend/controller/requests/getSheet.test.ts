import getSheets from './getSheets';
import * as client from '../client';
import Model from '../../Model';

//Tests for getSbeets
//Ownership: Carly Bates

jest.mock('../client'); // Mock the client module

describe('getSheets Class', () => {
    const publisher = 'testPublisher';
    const username = 'testUser';
    const password = 'testPass';
    let model: Model;

    beforeEach(() => {
        model = new Model();
        model.initializeSheets = jest.fn(); // Mock the initializeSheets method
    });

    it('should initialize with correct properties', () => {
        const instance = new getSheets(publisher, username, password);

        expect(instance).toHaveProperty('publisher', publisher);
        expect(instance).toHaveProperty('username', username);
        expect(instance).toHaveProperty('password', password);
    });

    it('should encode login credentials correctly and call client.getSheets', async () => {
        const instance = new getSheets(publisher, username, password);
        const response = { value: [{ sheet: 'sheet1' }, { sheet: 'sheet2' }] };

        (client.getSheets as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const loginString = `${username}:${password}`;
        const encoded = btoa(loginString);

        expect(client.getSheets).toHaveBeenCalledWith(publisher, encoded);
    });

    it('should call Model.initializeSheets with correct arguments', async () => {
        const instance = new getSheets(publisher, username, password);
        const response = { value: [{ sheet: 'sheet1' }, { sheet: 'sheet2' }] };

        (client.getSheets as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const sheetNames = response.value.map(arg => arg.sheet);

        expect(model.initializeSheets).toHaveBeenCalledWith(publisher, sheetNames);
    });

    it('should handle an empty response correctly', async () => {
        const instance = new getSheets(publisher, username, password);
        const response = { value: [] };

        (client.getSheets as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        expect(model.initializeSheets).toHaveBeenCalledWith(publisher, []);
    });
});