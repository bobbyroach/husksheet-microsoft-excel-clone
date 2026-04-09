import { ICell } from './ICell';
import Spreadsheet from './Spreadsheet';
import ACell from './ACell';

// Cells that contain only a string
// Ownership: Aneesh Ponduru
class TextCell extends ACell implements ICell {
    private value: string;

    // Constructor for TextCell class
    constructor(row: number, column: number, value: string, spreadsheet: Spreadsheet) {
        super(row, column, spreadsheet);
        this.value = value;
    }

    // Get the value of the TextCell
    getValue(): string {
        return this.value;
    }

    // Set the value of the TextCell
    setValue(value: string) {
        this.value = value;
    }

    getFormula(): string {
        throw new Error("Method not implemented.");
    }

    setFormula(formula: string): ICell {
        this.value = formula;
        return this
    }

    getErrorMessage(): string | null {
        throw new Error('Method not implemented.');
    }
}

export default TextCell;
