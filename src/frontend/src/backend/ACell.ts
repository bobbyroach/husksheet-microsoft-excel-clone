import { ICell } from "./ICell";
import Spreadsheet from "./Spreadsheet";

// Abstract class representing a cell in a spreadsheet
// Ownership: Arnav Sawant
abstract class ACell implements ICell {

    // The row number of the cell
    protected row: number;

    // The column number of the cell
    protected column: number;

    // The spreadsheet that the cell belongs to
    protected spreadsheet: Spreadsheet

    // Constructor for ACell class
    constructor(row: number, column: number, spreadsheet: Spreadsheet) {
        this.row = row;
        this.column = column;
        this.spreadsheet = spreadsheet;
    }

    // Get the column number of the cell
    getColumn(): number {
        return this.column;
    }

    // Get the column number of the cell as a letter
    getColumnAsLetter(): string {
        const base = 26;
        let columnNumber = this.column + 1;
        let columnName = "";

        while (columnNumber > 0) {
            let remainder = columnNumber % base;
            if (remainder === 0) {
                remainder = base;
                columnNumber--;
            }
            columnName = String.fromCharCode(remainder + 64) + columnName;
            columnNumber = Math.floor(columnNumber / base);
        }

        return columnName;
    }

    // Get the row number of the cell
    getRow(): number {
        return this.row;
    }

    // Abstract method to get the value of the cell
    abstract getValue(): number | string;

    // Abstract method to set the value of the cell
    abstract setValue(value: string | number): void;

    // Abstract method to set the formula of a cell
    abstract setFormula(formula: string): ICell;

    // Abstract method to get the formula of a cell
    abstract getFormula(): string;

    // Abstract method to get the error message of a cell
    abstract getErrorMessage(): string | null;

    // Get the ID of the spreadsheet that the cell belongs to
    getSpreadSheetID(): string {
        return this.spreadsheet.getID();
    }
}

export default ACell;
