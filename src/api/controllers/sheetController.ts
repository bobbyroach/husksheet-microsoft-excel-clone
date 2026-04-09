import Spreadsheet from "../models/spreadsheet";
import Publisher from "../models/publisher";

async function getPublishers(req, res) {
    try {
        const publishers = await Publisher.find({});
        const result = publishers.map(pub => ({publisher: pub.name}));
        res.send(publishers);
    } catch (error) {
        res.status(500).send({message: 'Error while fetching publishers: ', error});
    }
}

async function getSheets(req, res) {
    const { publisher } = req.body;
    try {
        const publisherDoc = await Publisher.findOne({name: publisher});
        const sheets = await Spreadsheet.find({owner: publisher});
        const sheetNames = sheets.map(sheet => sheet.sheetName);
        res.send(sheetNames);
    } catch (error) {
        res.status(500).send({message: 'Error while fetching sheets: ', error});
    }
}