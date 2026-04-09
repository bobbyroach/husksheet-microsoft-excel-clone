//@owner Arnav Sawant
import { IRequest } from './IRequest';
import Model from '../../Model';
import * as client from '../client';

// Request to get all the sheets for a publisher, this request is used when the user wants to see all the sheets for a certain publisher. Our implementation uses this enpoint to get all the sheets for all publishers
class getSheets implements IRequest {
    private readonly publisher: string;
    private readonly username: string;
    private readonly password: string;

    constructor(publisher: any, username: any, password: any) {
        this.publisher = publisher;
        this.username = username;
        this.password = password;
    }

    async execute(Model: Model): Promise<void> {
        const loginString = this.username + ':' + this.password
        const encoded = btoa(loginString)
        const response = await client.getSheets(this.publisher, encoded);

        // will return list of all publishers based on API response
        const sheetNames = response.value.map((argument) => argument.sheet);

        // will add the sheets to the model
        Model.initializeSheets(this.publisher, sheetNames)
    }
}

export default getSheets