//@owner Arnav Sawant

import { IRequest } from "./IRequest";
import Model from "../../Model";

/**
 *  Abstract class that all requests can extend from, contains common 
 * methods and properties for all requests. If you are making a new 
 * request, which requires basic authentication please extend from this 
 * class. The constructor of this class and methods can be easily used to 
 * pass in basic authentication headers through the requests by calling 
 * the encodeLoginString method to get the encoded string which can be 
 * used as a header for basic authentication.
 * */
export class ARequest implements IRequest {
    private readonly username: string;
    private readonly password: string;
    constructor(username: any, password: any) {
        this.username = username;
        this.password = password;
    }

    async execute(Model: Model): Promise<void> {
    }

    //method for encoding the login string based on username and password
    protected encodeLoginString(): string {
        const loginString = this.username + ':' + this.password
        const encoded = btoa(loginString)
        return encoded
    }

    //method for getting the username
    protected getUsername(): string {
        return this.username;
    }

    //method for getting the password
    protected getPassword(): string {
        return this.password;
    }
}