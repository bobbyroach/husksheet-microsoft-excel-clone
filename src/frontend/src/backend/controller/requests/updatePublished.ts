//@owner Arnav Sawant
import { IRequest } from './IRequest';
import Model from '../../Model';
import * as client from '../client';
import axios from 'axios';
import { ARequest } from './ARequest';

// Request to update the published updates for a sheet, this request is used when the publisher wants to send updates to the subscribers 
class UpdatePublished extends ARequest implements IRequest {
    private publisher: string;
    private spreadsheet: string;
    private id: number;
    private payload: string;

    constructor(publisher: string, spreadsheet: string, id: number, payload: string, username: string, password: string) {
        super(username, password);
        this.publisher = publisher;
        this.spreadsheet = spreadsheet;
        this.id = id;
        this.payload = payload;
    }

    async execute(Model: Model): Promise<void> {
        const encoded = this.encodeLoginString();
        const response = await client.updatePublished(this.publisher, this.spreadsheet, this.id, this.payload, encoded);

        Model.addUpdatesForPublished(this.publisher, this.spreadsheet, this.payload);
    }
}

export default UpdatePublished
