import UpdatePublished from './updatePublished';
import * as client from '../client';
import Model from '../../Model';

//Tests for updatePublished
//Ownership: Carly Bates

jest.mock('../client'); // Mock the client module

describe('UpdatePublished Class', () => {
    const publisher = 'testPublisher';
    const spreadsheet = 'testSpreadsheet';
    const id = 123;
    const payload = 'testPayload';
    const username = 'testUser';
    const password = 'testPass';
    let model: Model;

    beforeEach(() => {
        model = new Model();
        model.addUpdatesForPublished = jest.fn(); // Mock the addUpdatesForPublished method
    });

    it('should initialize with correct properties', () => {
        const instance = new UpdatePublished(publisher, spreadsheet, id, payload, username, password);

        expect(instance).toHaveProperty('publisher', publisher);
        expect(instance).toHaveProperty('spreadsheet', spreadsheet);
        expect(instance).toHaveProperty('id', id);
        expect(instance).toHaveProperty('payload', payload);
        expect(instance).toHaveProperty('username', username);
        expect(instance).toHaveProperty('password', password);
    });

    it('should encode login credentials correctly and call client.updatePublished', async () => {
        const instance = new UpdatePublished(publisher, spreadsheet, id, payload, username, password);
        const response = { status: 'success' };

        (client.updatePublished as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const encoded = (instance as any).encodeLoginString(); // Access the protected method

        expect(client.updatePublished).toHaveBeenCalledWith(publisher, spreadsheet, id, payload, encoded);
    });

    it('should call Model.addUpdatesForPublished with correct arguments', async () => {
        const instance = new UpdatePublished(publisher, spreadsheet, id, payload, username, password);
        const response = { status: 'success' };

        (client.updatePublished as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        expect(model.addUpdatesForPublished).toHaveBeenCalledWith(publisher, spreadsheet, payload);
    });
});