import Spreadsheet from './Spreadsheet'
import User from './User';
import { forEach, update } from 'lodash';


class Model {
    private spreadsheets: Spreadsheet[];
    private spreadsheetKeys: Set<string>;
    private users: User[];
    private currentUsername: string;
    private currentPwd: string;
    private encodedCred: string;

    constructor() {
        this.spreadsheets = [];
        this.users = [];
        this.currentUsername = '';
        this.spreadsheetKeys = new Set()
        this.currentPwd = '';
        this.encodedCred = '';
    }

    /**
     * Adds a new publisher to the database
     * @param users - list of users to add to the database
     */
    addPublishers(users: string[]): void {
        let userList: User[] = []
        users.forEach(user => {
            userList.push(new User(user, "Password"))
        })
        this.users = userList
    }

    /**
     * Returns all publishers in the database
     * @returns list of publishers
     */
    getPublishers() {
        return this.users
    }

    /**
    * Returns all spreadsheets in the database
    * @returns database's spreadsheets
    */
    getSpreadsheets(): Spreadsheet[] {
        return this.spreadsheets
    }

    /**
    * Adds a newly logged in user to keep track of in this database
    * @param user 
    */
    addUserToSession(user: User): void {
        this.users.push(user)
        this.currentUsername = user.getUserName()
    }

    /**
     * Finds a spreadsheet in the database
     * @returns the spreadsheet if it exists, otherwise undefined
     */
    findSheet(publisher: string, sheetName: string): Spreadsheet | undefined {
        return this.spreadsheets.find(sheet => sheet.getPublisher() === publisher && sheet.getSheetName() === sheetName);
    }

    /**
     * Initializes all sheets of current user when logging in and gives 
     * them to the model.
     * @param publisher 
     */
    initializeSheets(publisher: string, sheetNames: (string | null)[]) {
        let sheetList: Spreadsheet[] = []
        // Push all sheets with valid sheetName
        sheetNames.forEach((sheetName) => {
            if (sheetName) {
                const key = `${publisher}-${sheetName}`
                // If spreadsheet has unique publisher + sheetname, add to spreadsheets
                if (!this.spreadsheetKeys.has(key)) {
                    this.spreadsheetKeys.add(key)
                    sheetList.push(new Spreadsheet(publisher, sheetName))
                }
            }
        })
        this.spreadsheets = [...this.spreadsheets, ...sheetList.slice()]
    }

    /**
     * Creates a new sheet and adds it to the database
     * @param publisher - the publisher of the sheet
     * @param sheetName - the name of the sheet
     * @param rows - the number of rows in the sheet
     * @param columns - the number of columns in the sheet
     * @returns void
     */
    createSheet(publisher: string, sheetName: string | null, rows?: number, columns?: number): void {
        if (sheetName === null) {
            return;
        }
        const spreadsheet = (rows && columns && rows > 0 && columns > 0)
            ? new Spreadsheet(publisher, sheetName, rows, columns)
            : new Spreadsheet(publisher, sheetName)

        // Only add spreadsheet if it has unique publisher-sheetname combo
        const key = `${publisher}-${sheetName}`
        if (!this.spreadsheetKeys.has(key)) {
            this.spreadsheetKeys.add(key)
            this.spreadsheets.push(spreadsheet)
        }
    }

    /**
     * Removes a sheet from the database
     * @param publisher - the publisher of the sheet
     * @param spreadsheet - the name of the sheet
     * @returns void
     */
    removeSheet(publisher: string, spreadsheet: string): void {
        const sheet = this.findSheet(publisher, spreadsheet);
        if (sheet) {
            const index = this.spreadsheets.indexOf(sheet);
            this.spreadsheets.splice(index, 1);
        }
    }

    /**
     * Add updates for a published spreadsheet
     * @param publisher - the publisher of the sheet
     * @param spreadsheet - the name of the sheet
     * @param updates - the updates to add
     * @returns void
     */
    addUpdatesForPublished(publisher: string, spreadsheet: string, updates: string | null): void {
        const sheet = this.findSheet(publisher, spreadsheet);

        if (updates) {
            const updateArray = updates.split('\n');

            forEach(updateArray, (update: string) => {
                if (sheet) {
                    sheet.performUpdate(update);
                }
            });
        }
    }

    /**
     * Returns all subscription updates for this spreadsheet
     * @param publisher : User
     * @param spreadsheet 
     */
    getSubscriptionUpdates(publisher: string, spreadsheet: string): string[][] {
        const sheet = this.findSheet(publisher, spreadsheet)
        const updates = sheet ? sheet.getSubscriptionUpdates() : []

        return updates
    }

    /**
     * Adds an update for a subscription to the passed in spreadsheet
     * @param publisher : User
     * @param spreadsheet 
     * @param updates : Adds a list of updates represented as strings, possibly null
     */
    addUpdatesForSubscription(publisher: string, spreadsheet: string, updates: (string | null)[]): void {
        const sheet = this.findSheet(publisher, spreadsheet);

        updates.forEach(update => {
            if (update) {
                const updateArray = update.split('\n');

                if (sheet) {
                    sheet.addSubscriptionUpdate(updateArray);
                }
            }
        })
    }

    /**
     * Gets all updates for subscription for passed in spreadsheet
     * @param publisher : User
     * @param spreadsheet 
     * @param updates : Adds a list of updates represented as strings, possibly null
     */
    addAllUpdatesForSubscription(publisher: string, spreadsheet: string, updates: (string | null)[]): void {
        const sheet = this.findSheet(publisher, spreadsheet);
        const updatedUpdatesArray: string[][] = []

        updates.forEach(update => {
            if (update) {
                const updateArray = update.split('\n');
                updatedUpdatesArray.push(updateArray)
            }
        })

        if (sheet) {
            sheet.addAllSubscriptionUpdates(updatedUpdatesArray);
        }
    }

    /**
     * Get the current user's username
     * @returns the current user's username
     */
    getCurrentUsername(): string {
        return this.currentUsername
    }

    /**
     * Get the current user's password
     * @returns the current user's password
     */
    getCurrentPwd(): string {
        return this.currentPwd
    }

    /**
     * Get the current user's encoded credentials
     * @returns the current user's encoded credentials
     */
    getEncodedCred(): string {
        return this.encodedCred
    }

    /**
     * Change the current user's credentials
     * @param username - the new credentials
     */
    changeEncodedCred(encoded: string): void {
        this.encodedCred = encoded
    }
}

export default Model;

