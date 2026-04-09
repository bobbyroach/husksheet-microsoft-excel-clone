import getUpdatesForPublished from './getUpdatesForPublished';
import * as client from '../client';
import Model from '../../Model';

//Tests for getUpdates
//Ownership: Carly Bates

jest.mock('../client'); // Mock the client module

describe('getUpdatesForPublished Class', () => {
    const publisher = 'testPublisher';
    const spreadsheet = 'testSpreadsheet';
    const id = 123;
    const username = 'testUser';
    const password = 'testPass';
    let model: Model;

    beforeEach(() => {
        model = new Model();
        model.addUpdatesForPublished = jest.fn(); // Mock the addUpdatesForPublished method
    });

    it('should initialize with correct properties', () => {
        const instance = new getUpdatesForPublished(publisher, spreadsheet, id, username, password);

        expect(instance).toHaveProperty('publisher', publisher);
        expect(instance).toHaveProperty('spreadsheet', spreadsheet);
        expect(instance).toHaveProperty('id', id);
        expect(instance).toHaveProperty('username', username);
        expect(instance).toHaveProperty('password', password);
    });

    it('should encode login credentials correctly and call client.getUpdatesForPublished', async () => {
        const instance = new getUpdatesForPublished(publisher, spreadsheet, id, username, password);
        const response = { value: [{ payload: null}, { payload: null }] };

        (client.getUpdatesForPublished as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const encoded = (instance as any).encodeLoginString(); // Access the protected method

        expect(client.getUpdatesForPublished).toHaveBeenCalledWith(publisher, spreadsheet, id, encoded);
    });

    it('should call Model.addUpdatesForPublished with correct arguments', async () => {
        const instance = new getUpdatesForPublished(publisher, spreadsheet, id, username, password);
        const response = { value: [{ payload: 'update1' }] };

        (client.getUpdatesForPublished as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const updates = response.value[0].payload

        expect(model.addUpdatesForPublished).toHaveBeenCalledWith(publisher, spreadsheet, updates);
    });

});