// #Owner: Sid Mallareddygari

// username:password df43r2r
import * as dao from './dao';
// const users: { id: number, username: string, password: string, firstName: string, lastName: string }[] = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

import express, { Request, Response } from "express";
//import { basicAuth } from "./middleware";
/*

export default function Routes(app: express.Application) {
    const bodyParser = require('body-parser');
    app.use(bodyParser.json());

    // Route for successful authentication
    const successfulAuth = (req: Request, res: Response) => {
        res.send("Successful Authentication!");
    };

    const getPassword = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            return res.status(401).send("Unauthorized");
        }

        const base64Credentials = authHeader.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
        const [username] = credentials.split(":");

    
        const FetchPassword = await dao.getPassword(username);

        if (!FetchPassword) {
            return res.status(404).send("Password not found");
        }

        res.send({
            success: true,
            value: { password: FetchPassword }
        });
    }
    /*


    

    // Test function
    const test = async (req: Request, res: Response) => {
        res.send('test123');
    };

    // Define routes
    app.get("/", basicAuth, successfulAuth);
    app.get("/api/v1/username", basicAuth, getUsername);
    app.get("/api/v1/test", test);
}
*/

// Function to get just the username
export const getUsername = async (req: Request, res: Response): Promise<boolean> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return false
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    console.log(credentials)
    const [username] = credentials.split(":");
    console.log('username ', username)
    const [, password] = credentials.split(":");
    console.log('usernpasswordame ', password)

    const FetchUser = await dao.getUserByUsername(username);
    const fetchedUsername = FetchUser?.username;
    
    console.log('fetchedUSer: ', FetchUser);

    if (!fetchedUsername) {
        return false
    }
    else {
        const FetchPassword = await dao.getPassword(fetchedUsername);
        const fetchedPassword = FetchUser?.password;
        console.log('password: ', fetchedPassword);
        if (fetchedPassword != password) {
            return false
        }
        else return true
    }

};
