//@author Arnav Sawant
import axios from 'axios';
import { create } from "lodash";
import React from 'react';

//API base URL, refer here to change the base API URL
const API_BASE = "http://localhost:8081"
// const API_BASE = "https://husksheets.fly.dev"
//API v1 URL
const v1_API = `${API_BASE}/api/v1`

// Argument object which is to be used in API requests
// @param publisher: the publisher of the sheet
// @param sheet: the name of the sheet
// @param id: the id of the update or subscription update
// @param payload: the content of the update or subscription update (i.e $D7 5)
type Argument = {
    publisher: string;
    sheet: string | null;
    id: number | null;
    payload: string | null;
};

// Result object which is expected to be returned by the API
// @param success: tells whether the request was successful
// @param message: if the request was not successful, this field will contain the error message
// @param value: the value to be returned by the API, which is a list of type Argument
type Result = {
    success: boolean;
    message: string;
    value: Argument[];
};

// create a dictionary in the type of the Argument object, a list of which is to be returned by the API in the value field of the result object.
function createArgument(publisher: string, sheet: string | null, id: Number | null, payload: String | null): any {
    return {
        "publisher": publisher,
        "sheet": sheet,
        "id": id,
        "payload": payload
    };
}

// Get all the publishers in the database
export const getPublishers = async (encoded: string): Promise<Result> => {
    const response = await axios.get(`${v1_API}/getPublishers`,
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        }
    );
    return response.data;
};

// Get all the sheets for the given publisher
export const getSheets = async (publisher: string, encoded: string): Promise<Result> => {
    const response = await axios.post(`${v1_API}/getSheets`, createArgument(publisher, null, null, null),
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        });
    return response.data;
};

// create a new sheet with the given publisher and sheet name
export const createSheet = async (publisher: string, sheet: string, encoded: string): Promise<Result> => {
    const response = await axios.post(`${v1_API}/createSheet`, createArgument(publisher, sheet, null, null),
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        });
    return response.data;
};

// delete a sheet with the given publisher and sheet name
export const deleteSheet = async (publisher: string, sheet: string, encoded: string): Promise<Result> => {
    const response = await axios.post(`${v1_API}/deleteSheet`, createArgument(publisher, sheet, null, null),
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        });
    return response.data;
};

// Get all the subscription updates for the spreadsheet of the given publisher and sheet name
export const getUpdatesForSubscription = async (publisher: string, sheet: string, id: number, encoded: string): Promise<Result> => {
    const response = await axios.post(`${v1_API}/getUpdatesForSubscription`, createArgument(publisher, sheet, id, null),
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        }
    );
    return response.data;
};

// Get all the published updates for the spreadsheet of the given publisher and sheet name
export const getUpdatesForPublished = async (publisher: string, sheet: string, id: Number, encoded: string): Promise<Result> => {
    const response = await axios.post(`${v1_API}/getUpdatesForPublished`, createArgument(publisher, sheet, id, null),
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        });
    return response.data;
};


// Update the published updates for the spreadsheet of the given publisher and sheet name
export const updatePublished = async (publisher: string, sheet: string, id: Number, payload: String, encoded: string): Promise<Result> => {
    const response = await axios.post(`${v1_API}/updatePublished`, createArgument(publisher, sheet, null, payload),
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        });
    return response.data;
};

// Update the subscription updates for the spreadsheet of the given publisher and sheet name
export const updateSubscription = async (publisher: string, sheet: string, id: Number, payload: String, encoded: string): Promise<Result> => {
    const response = await axios.post(`${v1_API}/updateSubscription`, createArgument(publisher, sheet, null, payload),
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        });
    return response.data;
};

// Check if the users credentials are valid
export const checkLogin = async (encoded: string): Promise<Result> => {
    const response = await axios.get(
        `${v1_API}/register`,
        {
            headers: {
                'Authorization': `Basic ${encoded}`
            }
        }
    );
    return response.data;
};