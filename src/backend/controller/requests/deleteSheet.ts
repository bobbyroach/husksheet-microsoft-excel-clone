//@owner Arnav Sawant
import { IRequest } from './IRequest';
import Model from '../../Model';
import * as client from '../client';
import { ARequest } from './ARequest';

// Request to delete a sheet, this request is used when the user wants to delete a sheet
class deleteSheet extends ARequest implements IRequest {
    private publisher: string;
    private spreadsheet: string;

    constructor(publisher: string, spreadsheet: string, username: string, password: string) {
        super(username, password);
        this.publisher = publisher;
        this.spreadsheet = spreadsheet;
    }

    async execute(Model: Model): Promise<void> {
        const encoded = this.encodeLoginString();
        const response = await client.deleteSheet(this.publisher, this.spreadsheet, encoded);

        Model.removeSheet(this.publisher, this.spreadsheet);
    }
}

export default deleteSheet