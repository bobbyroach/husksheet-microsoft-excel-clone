import { strict } from 'assert';
import mongoose from 'mongoose';

const spreadsheetSchema = new mongoose.Schema({
    sheetName: { type: String, required: true },
    publisherName: { type: String, required: true },
    editorNames: { type: [String], required: true },
    passkey: { type: String, required: true },
    updates: [{
        updateId: { type: Number, required: true },
        updateDate: { type: Date, required: true },
        updateEditor: { type: String, required: true },
        updateContent: { type: String, required: true }
    }],
    subscriptionUpdates: [{
        updateId: { type: Number, required: true },
        updateDate: { type: Date, required: true },
        updateEditor: { type: String, required: true },
        updateContent: { type: String, required: true }
    }]
});

const Spreadsheet = mongoose.model("Spreadsheets", spreadsheetSchema, "Spreadsheets");

export default Spreadsheet;