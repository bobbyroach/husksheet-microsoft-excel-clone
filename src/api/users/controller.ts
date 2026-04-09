// Owner: Sid Mallareddygari
import * as dao from './dao';
import * as authentication from './authenticate';
import express, { Request, Response } from "express";

export function(app: express.Application): any {
    const username = authentication.Routes(app).getUserName;


}

