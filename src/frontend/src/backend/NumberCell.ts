import { ICell } from "./ICell";
import Spreadsheet from "./Spreadsheet";
import ACell from "./ACell";

//Cells that contain only a number
// Ownership: Aneesh Ponduru
class NumberCell extends ACell implements ICell {
    private value: number
    constructor(row: number, column: number, value: number, spreadsheet: Spreadsheet) {
        super(row, column, spreadsheet);
        this.value = value;
    }
    getFormula(): string {
        throw new Error("Method not implemented.");
    }

    getValue(): number {
        return this.value;
    }

    setValue(value: number): void { // Change the parameter type to match the base class
        this.value = value;
    }

    setFormula(formula: string): ICell {
        this.value = Number(formula);
        return this
    }

    getErrorMessage(): string | null {
        throw new Error('Method not implemented.');
    }

} export default NumberCell;