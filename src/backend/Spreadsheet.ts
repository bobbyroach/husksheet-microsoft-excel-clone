import { ICell } from "./ICell";
import FormulaCell from "./FormulaCell";
import { StringMap } from "../utils/types";
import { RefDetails } from "../utils/types";
 
// Class to represent a spreadsheet
// Ownership: Aneesh Ponduru
class Spreadsheet {
    private cells: ICell[][];
    private updates: StringMap;
    private spreadsheetID: string;
    private sheetName: string;
    private publisher: string;
    private subscriptionUpdates: string[][]
    private autoUpdates: boolean
    private errorMessage: string
 
    constructor(publisher: string, sheetName: string, rows: number = 200, columns: number = 200) {
        this.publisher = publisher;
        this.sheetName = sheetName
        this.cells = [];
        this.updates = {};
        this.subscriptionUpdates = [];
        this.spreadsheetID = new Date().getTime().toString();
        this.autoUpdates = true
        this.errorMessage = ""
 
        // Initialize a 2D array of cells with empty string values
        for (let i = 0; i < rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < columns; j++) {
                this.cells[i][j] = new FormulaCell(i, j, "", this);
            }
        }
    }
 
    // Returns this spreadSheet's name
    getSheetName() {
        return this.sheetName;
    }
 
    // Returns this spreadSheet's publisher
    getPublisher() {
        return this.publisher;
    }
 
    /**
     * Returns the cell at the specified row and column
     * @param row       - The row of the cell
     * @param column    - The column of the cell
     */
    getCell(row: number, column: number): ICell {
        if (row < 0 || row >= this.cells.length || column < 0 || column >= this.cells[0].length) {
            throw new Error("Tried to load invalid cell coordinates");
        }
        return this.cells[row][column];
    }

    // Returns this spreadsheet's error message
    // Error message is only used when loading in a spreadsheet
    getErrorMessage() {
        return this.errorMessage
    }

    // Sets this spreadsheet's error message
    setErrorMessage(message: string) {
        this.errorMessage = message
    }
 
    /**
     * Sets the value of a cell in the spreadsheet
     * @param row       - The row of the cell
     * @param column    - The column of the cell
     * @param value     - The value to set in the cell
     */
    setCell(cell: ICell) {
        this.cells[cell.getRow()][cell.getColumn()] = cell
        this.errorMessage = ""
    }
 
    /**
     * Returns the spreadSheet's 2D array of ICells
     */
    getAllCells(): ICell[][] {
        return this.cells;
    }
 
    /**
     * Returns true if the given string is a formula
     * @param value - The string to check
     */
    isFormula(value: string): boolean {
        return value[0] === "=";
    }
 
    /**
     * Adds an update to the spreadsheet's dictionary of current updates
     * @param update : string representing a change to a cell
     */
    addUpdate(key: string, update: string): void {
        this.updates[key] = update
        this.errorMessage = ""
    }
 
    /**
     * Returns this spreadsheet's updates as a dictionary
     */
    getUpdates(): StringMap {
        return this.updates;
    }

    /**
     * Adds an update to the subscription updates field
     * @param update : string representing update
     */
    addSubscriptionUpdate(update: string[]): void {
        this.subscriptionUpdates.push(update)
        this.errorMessage = ""
    }

    /**
     * Adds all subscription updates at once 
     * @param updates : all subscription updates stored in 2d array
     */
    addAllSubscriptionUpdates(updates: string[][]): void {
        this.subscriptionUpdates = updates
        this.errorMessage = ""
    }

    /**
     * Returns all subscription updates for this spreadsheet
     */
    getSubscriptionUpdates(): string[][] {
        return this.subscriptionUpdates
    }
 
    /**
     * Returns the number of rows in the spreadsheet
     */
    getRows(): number {
        return this.cells.length;
    }
 
    /**
     * Returns the number of columns in the spreadsheet
     */
    getColumns(): number {
        return this.cells[0].length;
    }
 
    /**
     * Returns spreadsheet's id
     * @returns spreadsheet's id
     */
    getID(): string {
        return this.spreadsheetID;
    }

    /**
     * Returns the auto updates field
     * @returns boolean
     */
    autoUpdatesEnabled(): boolean {
        return this.autoUpdates
    }
 
    /**
     * Sets the auto updates field to passed in boolean
     * @param flag - boolean to set auto updates to
     * @returns void
     */ 
    setAutoUpdates(flag: boolean) {
        this.autoUpdates = flag
    }
 
    /**
     * Parses a reference string into a RefDetails object
     * @param input - string representing a reference
     * @returns RefDetails object
     */
    private parseRef = (input: string): RefDetails | null => {
        // Regular expression to match the reference and value
        const regex = /^\s*\$([A-Z]+)(\d+)\s+(.*)\s*$/i;
        const match = input.match(regex);
 
        if (match) {
            const columnString = match[1].toUpperCase();
            const rowString = match[2];
            const valueString = match[3];
 
            // Convert column string to column number
            let columnNumber = 0;
            for (let i = 0; i < columnString.length; i++) {
                columnNumber = columnNumber * 26 + (columnString.charCodeAt(i) - 'A'.charCodeAt(0) + 1) - 1;
            }
 
            // Convert row string to row number
            const rowNumber = parseInt(rowString, 10) - 1;
 
            // Parse the value
            let value: string | number | null;
            if (valueString === "") {
                value = ""
            } else if (valueString.startsWith('"') && valueString.endsWith('"')) {
                value = valueString.slice(1, -1); // Strip quotes for string values
            } else if (!isNaN(Number(valueString))) {
                value = Number(valueString); // Convert numeric values
            } else {
                value = valueString; // Treat as raw string for formulas and other text
            }

            return { column: columnNumber, row: rowNumber, value };
        } else {
            return null;
        }
    };
 
    /**
     * Updates the spreadsheet with the given update
     * @param update : string representing a change to a cell
     * @returns void
     */
    performUpdate(update: string): void {
        try {
            const ref = this.parseRef(update);
            if (ref) {
                const cell = this.getCell(ref.row, ref.column);
                cell.setFormula(ref.value.toString());
            }
        // Catch an error loading only updates for one cell so the rest can load
        } catch (error) {
            this.setErrorMessage(
                (error instanceof Error) ? error.message : "Error updating cells"
            )
        }
    }
 
} export default Spreadsheet;
