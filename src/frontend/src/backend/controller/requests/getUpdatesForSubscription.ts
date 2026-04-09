//@owner Arnav Sawant
import { IRequest } from './IRequest'
import Model from '../../Model'
import * as client from '../client'
import axios from 'axios'
import { ARequest } from './ARequest'

// Request to update the subscription updates for a sheet, this request is used when the user wants to locally render subscriptionUpdates for a sheet
class GetUpdatesForSubscription extends ARequest implements IRequest {
    private readonly publisher: string;
    private readonly spreadsheet: string;
    private readonly id: number;

    constructor(publisher: string, spreadsheet: string, id: number, username: string, password: string) {
        super(username, password);
        this.publisher = publisher;
        this.spreadsheet = spreadsheet;
        this.id = id;
    }

    async execute(Model: Model): Promise<void> {
        const encoded = this.encodeLoginString();
        const response = await client.getUpdatesForSubscription(this.publisher, this.spreadsheet, 0, encoded);

        const updates = response.value[0].payload

        if (updates && updates.substring(0, 1) !== "$") {
            throw new Error("Invalid Payload")
        }
        Model.addUpdatesForPublished(this.publisher, this.spreadsheet, updates);
    }
}

export default GetUpdatesForSubscription
