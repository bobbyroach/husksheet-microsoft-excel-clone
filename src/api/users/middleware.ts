//Owner: Sid Mallareddygari

import { Request, Response, NextFunction } from "express";
import { getUserByUsername } from "./dao";
import { Buffer } from "buffer";

// function createResult(success: boolean, message: string | null, value: any[]): any {
//     return {
//         "success": success,
//         "message": message,
//         "value": value
//     };
// }

// // implementation of basic authentication
// // checks if the user is authorized to access the resource

// export const basicAuth = async (req: Request, res: Response) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Basic ")) {
//             return res.status(401).send("Unauthorized");
//         }

//         const base64Credentials = authHeader.split(" ")[1];
//         const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
//         const [username, password] = credentials.split(":");

//         const user = await getUserByUsername(username);

//         if (!user || user.password !== password) {
//             return res.status(401).send("Unauthorized");
//         }

//         console.log("User successfully logged in");
//         return res.status(200).createResult(true, null, [])
//     } catch (error) {
//         console.error("Authentication error:", error);
//         return res.status(401).send("Unauthorized");
//     }
// };

