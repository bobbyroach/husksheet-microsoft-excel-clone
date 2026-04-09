//Ownership: Arnav Sawant

import * as dao from "./dao";

import { getUsername } from "./users/authenticate";

//import {basicAuth} from "./users/middleware"
import { Request, Response, NextFunction } from "express";
import { getUserByUsername } from "./users/dao";
import { Buffer } from "buffer";

let currentUser = null;

function createResult(success: boolean, message: string | null, value: any[]): any {
    return {
        "success": success,
        "message": message,
        "value": value
    };
}
function createArgument(publisher: string, sheet: string | null, id: Number | null, payload: String | null): any {
    return {
        "publisher": publisher,
        "sheet": sheet,
        "id": id,
        "payload": payload
    };
}

export default function Routes(app: any) {
    const bodyParser = require('body-parser');
    app.use(bodyParser.json());

    const basicAuth = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Basic ")) {
                return res.status(401).send("Unauthorized");
            }

            const base64Credentials = authHeader.split(" ")[1];
            const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
            const [username, password] = credentials.split(":");

            const user = await getUserByUsername(username);

            if (!user || user.password !== password) {
                return res.status(401).send("Unauthorized");
            }

            console.log("User successfully logged in");
            const response = createResult(true, null, [])
            res.status(200);
            res.send(response);
        } catch (error) {
            console.error("Authentication error:", error);
            return res.status(401).send("Unauthorized");
        }
    };

    //Working 
    const getPublishers = async (req: Request, res: Response) => {
        try {
            res.status(200);
            const username = await getUsername(req, res)
            console.log(username)
            if (!username) {
                throw Error('ERRRORRORORORORO')
            }
            const publishers = await dao.getPublishers();
            console.log("Publishers Found: ", publishers);
            const returnList: any[] = [];
            const publisherNames = publishers.map((publisher) => {
                returnList.push(createArgument(publisher.publisherName, null, null, null));
            });
            const result = createResult(true, null, returnList);
            res.send(result);
        } catch (error) {
            res.status(401);
            console.error('Error querying publishers:', error);
            const response = createResult(false, 'Internal Server Error' + error, []);
            res.send(response);
        }
    }

    const getSheets = async (req: Request, res: Response) => {
        try {
            const username = await getUsername(req, res)
            if (!username) {
                throw Error('ERRRORRORORORORO')
            }
            const { publisher } = req.body;
            console.log(publisher);
            console.log(req.body);
            const sheets = await dao.getSheets(publisher);
            const returnList: any[] = [];
            const sheetNames = sheets.map((sheet) => {
                returnList.push(createArgument(publisher, sheet.sheetName, null, null))
            });
            const result = createResult(true, null, returnList);
            res.send(result);
        }
        catch (error) {
            console.error('Error querying publishers:', error);
            const response = createResult(false, 'Internal Server Error' + error, []);
            res.send(response);
        }
    }

    const deleteSheet = async (req: Request, res: Response) => {
        const { publisher, sheet } = req.body;
        try {
            const username = await getUsername(req, res)
            console.log(username)
            if (!username) {
                throw Error('ERRRORRORORORORO')
            }
            const sheets = await dao.deleteSheet(publisher, sheet);
            const response = createResult(true, null, []);
            res.send(response);
        } catch (error) {
            console.error('Error querying publishers:', error);
            const response = createResult(false, 'Internal Server Error' + error, []);
            res.send(response);
        }
    }

    const createSheet = async (req: Request, res: Response) => {
        const { publisher, sheet } = req.body;
        try {
            const username = await getUsername(req, res)
            console.log(username)
            if (!username) {
                throw Error('ERRRORRORORORORO')
            }
            const sheets = await dao.createSheet(publisher, sheet);
            res.status(200).send('Sheet Created');
        } catch (error) {
            console.error('Error querying publishers:', error);
            res.status(500).send('Internal Server Error ' + error);
        }
    }

    const getUpdatesForSubscription = async (req: Request, res: Response) => {
        const { publisher, sheet } = req.body;
        try {
            const username = await getUsername(req, res)
            console.log(username)
            if (!username) {
                throw Error('ERRRORRORORORORO')
            }
            const subscriptions = await dao.getUpdatesForSubscriptions(publisher, sheet);
            const returnList: any[] = [];
            // const returnVal = subscriptions.map((subscription) => { returnList.push(createArgument(publisher, sheet, subscription.subscriptionUpdates.map((update) => update.updateId), subscription.subscriptionUpdates.map((update) => update.updateContent))) });

            const returnVal = subscriptions.map((subscription) => {
                returnList.push(createArgument(publisher, sheet, subscription.updateId, subscription.updateContent))
            })

            const response = createResult(true, null, returnList);
            res.send(response);

        } catch (error) {
            console.error('Error querying publishers:', error);
            res.status(500).send('Internal Server Error' + error);
        }
    }

    const getUpdatesForPublished = async (req: Request, res: Response) => {
        const { publisher, sheet } = req.body;
        try {
            const username = await getUsername(req, res)
            console.log(username)
            if (!username) {
                throw Error('ERRRORRORORORORO')
            }
            const published = await dao.getUpdatesForPublished(publisher, sheet);
            const returnList: any[] = [];
            // const returnVal = subscriptions.map((subscription) => { returnList.push(createArgument(publisher, sheet, subscription.subscriptionUpdates.map((update) => update.updateId), subscription.subscriptionUpdates.map((update) => update.updateContent))) });

            const returnVal = published.map((update) => {
                returnList.push(createArgument(publisher, sheet, update.updateId, update.updateContent))
            })

            const response = createResult(true, null, returnList);
            res.send(response);

        } catch (error) {
            console.error('Error querying publishers:', error);
            res.status(500).send('Internal Server Error' + error);
        }
    }

    const updatePublished = async (req: Request, res: Response) => {
        const { publisher, sheet, payload } = req.body;
        try {
            const username = await getUsername(req, res)
            console.log(username)
            if (!username) {
                throw Error('ERRRORRORORORORO')
            }
            const sheets = await dao.updatePublished(publisher, sheet, payload);
            const response = createResult(true, null, []);
            res.send(response);
        } catch (error) {
            console.error('Error querying publishers:', error);
            res.status(500).send('Internal Server Error' + error);

        }
    }

    const updateSubscription = async (req: Request, res: Response) => {
        const { publisher, sheet, payload } = req.body;
        try {
            const username = await getUsername(req, res)
            console.log(username)
            if (!username) {
                throw Error('ERRRORRORORORORO')
            }
            const sheets = await dao.updateSubscription(publisher, sheet, payload);
            const response = createResult(true, null, []);
            res.send(response);
        } catch (error) {
            console.error('Error querying publishers:', error);
            res.status(500).send('Internal Server Error' + error);
        }
    }




    const test = async (req: Request, res: Response) => {

        res.send('test123');
    };
    // const createSheet = async (req: Request, res: Response) => {
    //     const { publisher, sheetName } = req.body;
    //     const sheets = await dao.createSheet(publisher, sheetName);
    //     const result = createResult(true, null, [sheets]);
    //     res.send(result);
    // };


    app.get("/api/v1/getPublishers", getPublishers)
    app.post("/api/v1/getSheets", getSheets)
    app.delete("/api/v1/deleteSheet", deleteSheet)
    app.post("/api/v1/createSheet", createSheet)
    app.post("/api/v1/getUpdatesForSubscription", getUpdatesForSubscription)
    app.post("/api/v1/getUpdatesForPublished", getUpdatesForPublished)
    app.post("/api/v1/updatePublished", updatePublished)
    app.post("/api/v1/updateSubscription", updateSubscription)
    app.get("/api/v1/register", basicAuth)
}
