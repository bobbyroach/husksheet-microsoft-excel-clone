import deleteSheet from './deleteSheet';
import * as client from '../client';
import Model from '../../Model';
import { ARequest } from './ARequest';

//Tests for deleteSheet
//Ownership: Carly Bates

jest.mock('../client'); // Mock the client module

describe('deleteSheet Class', () => {
    const publisher = 'testPublisher';
    const spreadsheet = 'testSpreadsheet';
    const username = 'testUser';
    const password = 'testPass';
    let model: Model;

    beforeEach(() => {
        model = new Model();
        model.removeSheet = jest.fn(); // Mock the removeSheet method
    });

    it('should initialize with correct properties', () => {
        const instance = new deleteSheet(publisher, spreadsheet, username, password);

        expect(instance).toHaveProperty('publisher', publisher);
        expect(instance).toHaveProperty('spreadsheet', spreadsheet);
        expect(instance).toHaveProperty('username', username);
        expect(instance).toHaveProperty('password', password);
    });

    it('should encode login credentials correctly and call client.deleteSheet', async () => {
        const instance = new deleteSheet(publisher, spreadsheet, username, password);
        const response = { status: 'success' };

        (client.deleteSheet as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const encoded = (instance as any).encodeLoginString(); // Access the protected method

        expect(client.deleteSheet).toHaveBeenCalledWith(publisher, spreadsheet, encoded);
    });

    it('should call Model.removeSheet with correct arguments', async () => {
        const instance = new deleteSheet(publisher, spreadsheet, username, password);
        const response = { status: 'success' };

        (client.deleteSheet as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        expect(model.removeSheet).toHaveBeenCalledWith(publisher, spreadsheet);
    });
});