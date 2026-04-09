import UpdateSubscription from './updateSubscription';
import * as client from '../client';
import Model from '../../Model';

//Tests for updateSubscription
//Ownership: Carly Bates

jest.mock('../client'); // Mock the client module

describe('UpdateSubscription Class', () => {
    const publisher = 'testPublisher';
    const spreadsheet = 'testSpreadsheet';
    const id = 123;
    const payload = 'testPayload';
    const username = 'testUser';
    const password = 'testPass';
    let model: Model;

    beforeEach(() => {
        model = new Model();
        model.addUpdatesForSubscription = jest.fn(); // Mock the addUpdatesForSubscription method
    });

    it('should initialize with correct properties', () => {
        const instance = new UpdateSubscription(publisher, spreadsheet, id, payload, username, password);

        expect(instance).toHaveProperty('publisher', publisher);
        expect(instance).toHaveProperty('spreadsheet', spreadsheet);
        expect(instance).toHaveProperty('id', id);
        expect(instance).toHaveProperty('payload', payload);
        expect(instance).toHaveProperty('username', username);
        expect(instance).toHaveProperty('password', password);
    });

    it('should encode login credentials correctly and call client.updateSubscription', async () => {
        const instance = new UpdateSubscription(publisher, spreadsheet, id, payload, username, password);
        const response = { status: 'success' };

        (client.updateSubscription as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const encoded = (instance as any).encodeLoginString(); // Access the protected method

        expect(client.updateSubscription).toHaveBeenCalledWith(publisher, spreadsheet, id, payload, encoded);
    });

    it('should call Model.addUpdatesForSubscription with correct arguments', async () => {
        const instance = new UpdateSubscription(publisher, spreadsheet, id, payload, username, password);
        const response = { status: 'success' };

        (client.updateSubscription as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        expect(model.addUpdatesForSubscription).toHaveBeenCalledWith(publisher, spreadsheet, [payload]);
    });
});