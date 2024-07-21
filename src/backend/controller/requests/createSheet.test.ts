import createSheet from './createSheet';
import * as client from '../client';
import Model from '../../Model';
import { ARequest } from './ARequest';

//Tests for createSheet
//Ownership: Carly Bates

jest.mock('../client'); // Mock the client module

describe('createSheet Class', () => {
    const publisher = 'testPublisher';
    const spreadsheet = 'testSpreadsheet';
    const username = 'testUser';
    const password = 'testPass';
    let model: Model;

    beforeEach(() => {
        model = new Model();
        model.createSheet = jest.fn(); // Mock the createSheet method
    });

    it('should initialize with correct properties', () => {
        const instance = new createSheet(publisher, spreadsheet, username, password);

        expect(instance).toHaveProperty('publisher', publisher);
        expect(instance).toHaveProperty('spreadsheet', spreadsheet);
        expect(instance).toHaveProperty('username', username);
        expect(instance).toHaveProperty('password', password);
    });

    it('should encode login credentials correctly and call client.createSheet', async () => {
        const instance = new createSheet(publisher, spreadsheet, username, password);
        const response = { status: 'success' };

        (client.createSheet as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const encoded = (instance as any).encodeLoginString(); // Access the protected method

        expect(client.createSheet).toHaveBeenCalledWith(publisher, spreadsheet, encoded);
    });

    it('should call Model.createSheet with correct arguments', async () => {
        const instance = new createSheet(publisher, spreadsheet, username, password);
        const response = { status: 'success' };

        (client.createSheet as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        expect(model.createSheet).toHaveBeenCalledWith(publisher, spreadsheet);
    });
});