import objects from "./database/cells";
// import {spreadsheet} from "./database/spreadsheet";
import database from "./database/index"
import mongoose from "mongoose";
import Publisher from "./models/publisher";
import Spreadsheet from "./models/spreadsheet";
import * as dao from "./dao"
import Routes from "./routes"
import cors from "cors";

//Ownership: Arnav Sawant
import express, { Express, Request, Response } from "express";
const app: Express = express();
app.use(cors())
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI || "";

mongoose.connect(mongoURI)
    .then(() => { console.log("Connected to MongoDB") })
    .catch((err) => console.log('mongoose connection error: ' + err));

Routes(app);

// app.get('/publishers', async (req: Request, res: Response) => {
//     try {
//         const publishers = await dao.getPublishers();
//         console.log("Publishers Found: ", publishers);
//         res.send(publishers);
//     } catch (error) {
//         console.error('Error querying publishers:', error);
//         res.status(500).send('Internal Server Error' + error);
//     }
// });

// app.get('/hello', async (req: Request, res: Response) => {
//     const users = await dao.getAll();
//     console.log(users)
//     res.json(users);

// });


// app.get('/getCells/:spreadsheetID', (req: Request, res: Response) => {
//     // Extract the parameters from the request
//     const { spreadsheetID } = req.params;
//     console.log(spreadsheetID)

//     // Logic to retrieve the cell value based on the spreadsheetID, row, and column
//     // Replace this with your actual implementation
//     const cells = objects;

//     // Return the cell value as the response
//     res.send(cells);
// });



// ///////////////////  v1 Endpoints    //////////////////s
// app.get("/api/v1/getSheets", (req, res) => {
//     const body = req.body
//     let response = {}
//     const publisher = body.publisher;
//     console.log(publisher)
//     const sheets =
//         database.spreadsheet.filter((sheet) => sheet.publisher === publisher);

//     const sheetNames = sheets.map((sheet) => sheet.name);
//     response = {
//         success: true,
//         message: null,
//         value: sheetNames
//     }
//     if (!sheets) {
//         response = {
//             success: false,
//             message: 'Publisher not Found: ' + publisher,
//             value: null
//         }
//     }
//     res.send(response);
// });

// app.delete("/api/v1/deleteSheet/:publisher/:sheet", (req, res) => {
//     const { publisher, sheet } = req.params;
//     database.spreadsheet = database.spreadsheet
//         .filter((s) => (s.publisher !== publisher) && (s.name !== sheet));
//     res.sendStatus(204);
// });

// app.post("/api/v1/createSheet/:publisher/:sheet", (req, res) => {
//     const { publisher, sheet } = req.params;
//     const newSheet = {
//         name: sheet,
//         id: 1,
//         publisher: publisher
//     };
//     database.spreadsheet.push(newSheet);
//     res.send(newSheet);
// });





// Start the server
app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
