import Spreadsheet from "./Spreadsheet";


/**
 * Represents a user in the system.
 * Owner -> Arnav Sawant
 */
class User {

    /**
     * The username of the user.
     */
    private username: string;

    /**
     * The password of the user.
     */
    private password: string;

    /**
     * The spreadsheets owned by the user.
     */
    private ownerSheets: Spreadsheet[] = [];

    /**
     * The spreadsheets the user has editing access to.
     */
    private editorSheets: Spreadsheet[] = [];

    /**
     * Creates a new User instance.
     * @param username - The username of the user.
     * @param password - The password of the user.
     */
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    /**
     * Gets the username of the user.
     * @returns The username of the user.
     */
    getUserName(): string {
        return this.username;
    }

    /**
     * Gets the password of the user.
     * @returns The password of the user.
     */
    getPassword(): string {
        return this.password;
    }

    /**
     * Adds a spreadsheet to the user's owned sheets.
     * @param sheet - The spreadsheet to add.
     */
    addToOwnerSheets(sheet: Spreadsheet): void {
        this.ownerSheets.push(sheet);
    }

    /**
     * Adds a spreadsheet to the user's editor sheets.
     * @param sheet - The spreadsheet to add.
     */
    addToEditorSheets(sheet: Spreadsheet): void {
        this.editorSheets.push(sheet);
    }

    /**
     * Gets the spreadsheets owned by the user.
     * @returns The spreadsheets owned by the user.
     */
    getOwnerSheets(): Spreadsheet[] {
        return this.ownerSheets;
    }

    /**
     * Gets the spreadsheets the user has editing access to.
     * @returns The spreadsheets the user has editing access to.
     */
    getEditorSheets(): Spreadsheet[] {
        return this.editorSheets;
    }

} export default User;