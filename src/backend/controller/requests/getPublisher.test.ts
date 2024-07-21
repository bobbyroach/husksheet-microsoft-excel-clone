import GetPublishers from './getPublishers';
import * as client from '../client';
import Model from '../../Model';

//Tests for getPublisher
//Ownership: Carly Bates

jest.mock('../client'); // Mock the client module

describe('GetPublishers Class', () => {
    const username = 'Publisher1';
    const password = 'pw123';
    let model: Model;

    beforeEach(() => {
        model = new Model();
        model.addPublishers = jest.fn(); // Mock the addPublishers method
    });

    it('should initialize with correct properties', () => {
        const instance = new GetPublishers(username, password);

        expect(instance).toHaveProperty('username', username);
        expect(instance).toHaveProperty('password', password);
    });

    it('should encode login credentials correctly and call client.getPublishers', async () => {
        const instance = new GetPublishers(username, password);
        const response = { value: [{ publisher: 'pub1' }, { publisher: 'pub2' }] };

        (client.getPublishers as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const loginString = `${username}:${password}`;
        const encoded = btoa(loginString);

        expect(client.getPublishers).toHaveBeenCalledWith(encoded);
    });

    it('should call Model.addPublishers with correct arguments', async () => {
        const instance = new GetPublishers(username, password);
        const response = { value: [{ publisher: 'pub1' }, { publisher: 'pub2' }] };

        (client.getPublishers as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        const publishers = response.value.map(arg => arg.publisher);

        expect(model.addPublishers).toHaveBeenCalledWith(publishers);
    });

    it('should handle an empty response correctly', async () => {
        const instance = new GetPublishers(username, password);
        const response = { value: [] };

        (client.getPublishers as jest.Mock).mockResolvedValue(response);

        await instance.execute(model);

        expect(model.addPublishers).toHaveBeenCalledWith([]);
    });
});