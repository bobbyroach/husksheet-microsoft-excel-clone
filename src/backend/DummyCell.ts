import { ICell } from './ICell';

// Cells that contain only a string (to be used for column and row names)
// Ownership: Aneesh Ponduru
class DummyCell implements ICell {
    private value: string;
    private row: number;
    private column: number

    // Constructor for DummyCell class
    constructor(value: string, row: number, column: number) {
        this.value = value;
        this.row = row 
        this.column = column
    }

    setFormula(formula: string): ICell {
        return this;
    }

    // Dummy cell only contains a value
    getFormula(): string {
        return this.value
    }
    
    // Dummy cell row and columns
    getRow(): number {
        return this.row
    }
    getColumn(): number {
        return this.column
    }

    // Dummy cell does not have methods for the following
    getColumnAsLetter(): string {
        throw new Error('Method not implemented.');
    }
    setValue(value: string | number): void {
        throw new Error('Method not implemented.');
    }
    getSpreadSheetID(): string {
        throw new Error('Method not implemented.');
    }
    getErrorMessage(): string | null {
        throw new Error('Method not implemented.');
    }

    // Get the value of the TextCell
    getValue(): string {
        return this.value;
    }
}

export default DummyCell;
