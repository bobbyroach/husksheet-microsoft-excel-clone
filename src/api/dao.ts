//Ownership: Arnav Sawant

import Spreadsheet from "./models/spreadsheet";
import Publisher from "./models/publisher";


export const getAll = () => Spreadsheet.find();

export const getPublishers = () => Spreadsheet.find({}, { publisherName: 1, _id: 0 });
export const getSheets = (publisher: string) => Spreadsheet.find({ publisherName: publisher }, { sheetName: 1, _id: 0 });


// export const getUpdatesForSubscriptions = (publisher: string, sheetName: String) => Spreadsheet.find({ publisherName: publisher, sheetName: sheetName }, { subscriptionUpdates: 1, _id: 0 })

export const getUpdatesForSubscriptions = (publisher: string, sheetName: String) => Spreadsheet.aggregate([
    {
        $match: {
            publisherName: publisher,
            sheetName: sheetName
        }
    },
    {
        $unwind: "$subscriptionUpdates"
    },
    {
        $project: {
            _id: 0,
            updateContent: "$subscriptionUpdates.updateContent",
            updateId: "$subscriptionUpdates.updateId",
            updateDate: "$subscriptionUpdates.updateDate",
            updateEditor: "$subscriptionUpdates.updateEditor"
        }
    }
]);


export const getUpdatesForPublished = (publisher: string, sheetName: String) => Spreadsheet.aggregate([
    {
        $match: {
            publisherName: publisher,
            sheetName: sheetName
        }
    },
    {
        $unwind: "$updates"
    },
    {
        $project: {
            _id: 0,
            updateContent: "$updates.updateContent",
            updateId: "$updates.updateId",
            updateDate: "$updates.updateDate",
            updateEditor: "$updates.updateEditor"
        }
    }
]);



export const createSheet = (publisher: string, sheetName: string) => Spreadsheet.create({ sheetName: sheetName, publisherName: publisher, editorNames: [], passkey: "123", updates: [], subscriptionUpdates: [] });



export const deleteSheet = (publisher: string, sheetName: string) => Spreadsheet.deleteOne({ publisherName: publisher, sheetName: sheetName });

export const updatePublished = (publisher: string, sheetName: string, payload: [any]) => Spreadsheet.updateOne({ publisherName: publisher, sheetName: sheetName }, {
    $push: {
        updates:
        {
            "updateId": 1,
            "updateDate": new Date(),
            "updateEditor": "Editor1",
            "updateContent": payload
        }
    }

});

export const updateSubscription = (publisher: string, sheetName: string, payload: [any]) => Spreadsheet.updateOne({ publisherName: publisher, sheetName: sheetName }, {
    $push: {
        subscriptionUpdates:
        {
            "updateId": 2,
            "updateDate": new Date(),
            "updateEditor": "Editor1",
            "updateContent": payload
        }
    }
});