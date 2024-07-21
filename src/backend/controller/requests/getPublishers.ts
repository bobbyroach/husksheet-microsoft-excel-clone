//@owner Arnav Sawant
import { IRequest } from './IRequest';
import Model from '../../Model';
import * as client from '../client';

// Request to get all publishers, this request is used when the user wants to get all publishers. Our implementation uses this enpoint to get all the publishers and uses this data to get all sheets
class GetPublishers implements IRequest {
    private readonly username: string;
    private readonly password: string;
    constructor(username: any, password: any) {
        this.username = username;
        this.password = password;
    }

    async execute(Model: Model): Promise<void> {
        const loginString = this.username + ':' + this.password
        const encoded = btoa(loginString)
        console.log("encoded: ", encoded)
        const response = await client.getPublishers(encoded);

        // will return list of all publishers based on API response
        const publishers = response.value.map((argument) => argument.publisher);

        // will add the publishers to the model
        Model.addPublishers(publishers);
    }
}

export default GetPublishers