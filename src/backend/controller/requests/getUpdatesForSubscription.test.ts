import GetUpdatesForSubscription from './getUpdatesForSubscription';
import * as client from '../client';
import Model from '../../Model';

//Tests for getUpdates
//Ownership: Carly Bates

jest.mock('../client'); // Mock the client module

describe('GetUpdatesForSubscription Class', () => {
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
        const instance = new GetUpdatesForSubscription(publisher, spreadsheet, id, username, password);

        expect(instance).toHaveProperty('publisher', publisher);
        expect(instance).toHaveProperty('spreadsheet', spreadsheet);
        expect(instance).toHaveProperty('id', id);
        expect(instance).toHaveProperty('username', username);
        expect(instance).toHaveProperty('password', password);
    });

    it('should encode login credentials correctly and call client.getUpdatesForSubscription', async () => {
        const instance = new GetUpdatesForSubscription(publisher, spreadsheet, id, username, password);
        const response = { value: [{ payload: 'sheet1' }, { payload: 'sheet2' }] };

        (client.getUpdatesForSubscription as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const encoded = (instance as any).encodeLoginString(); // Access the protected method

        expect(client.getUpdatesForSubscription).toHaveBeenCalledWith(publisher, spreadsheet, 0, encoded);
    });

    it('should call Model.addUpdatesForPublished with correct arguments', async () => {
        const instance = new GetUpdatesForSubscription(publisher, spreadsheet, id, username, password);
        const response = { value: [{ payload: '$A1 1' }] };

        (client.getUpdatesForSubscription as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const updates = response.value[0].payload;

        expect(model.addUpdatesForPublished).toHaveBeenCalledWith(publisher, spreadsheet, updates);
    });

    it('should handle an empty response correctly', async () => {
        const instance = new GetUpdatesForSubscription(publisher, spreadsheet, id, username, password);
        const response = { value: { payload: null } };

        (client.getUpdatesForSubscription as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        expect(model.addUpdatesForPublished).toHaveBeenCalledWith(publisher, spreadsheet, []);
    });
});