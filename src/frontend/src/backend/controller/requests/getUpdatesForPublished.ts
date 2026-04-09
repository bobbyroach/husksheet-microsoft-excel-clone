//@owner Arnav Sawant
import { IRequest } from './IRequest';
import Model from '../../Model';
import * as client from '../client';
import { ARequest } from './ARequest';

// Request to get updates for a published sheet, this request is used when the user wants to locally render published updates for a sheet
class getUpdatesForPublished extends ARequest implements IRequest {
    private publisher: string;
    private spreadsheet: string;
    private id: number;

    constructor(publisher: string, spreadsheet: string, id: number, username: string, password: string) {
        super(username, password);
        this.publisher = publisher;
        this.spreadsheet = spreadsheet;
        this.id = id;
    }

    async execute(Model: Model): Promise<void> {
        const encoded = this.encodeLoginString();
        const response = await client.getUpdatesForPublished(this.publisher, this.spreadsheet, this.id, encoded);
        const updates = response.value[0].payload

        if (updates) {
            // Add updates to subscription for permanent changes
            const publishedResponse = await client.updatePublished(this.publisher, this.spreadsheet, this.id, updates, encoded)

            Model.addUpdatesForPublished(this.publisher, this.spreadsheet, updates);
        }
    }
}

export default getUpdatesForPublished