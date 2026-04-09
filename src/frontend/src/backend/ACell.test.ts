import ACell from "./ACell";
import { ICell } from "./ICell";
import Spreadsheet from "./Spreadsheet";

//Tests for ACell
//Ownership: Carly Bates

describe("ACell", () => {
    let cell: ACell;
    let spreadsheet: Spreadsheet;

    beforeEach(() => {
        spreadsheet = new Spreadsheet("test publisher", "test name", 3, 3);
        cell = new (class extends ACell {
            constructor(row: number, column: number, spreadsheet: Spreadsheet) {
                super(row, column, spreadsheet);
            }
            getValue(): number | string {
                return 0;
            }
            setValue(value: string | number): void {}
            setFormula(formula: string): ICell {
                return this
            }
            getFormula(): string {
                return "";
            }
            getErrorMessage(): string | null {
                return null;
            }
        })(1, 1, spreadsheet);
    });

    test("should initialize with correct row and column", () => {
        expect(cell.getRow()).toBe(1);
        expect(cell.getColumn()).toBe(1);
    });

    test("should get column letter for column number less than or equal to 26", () => {
        expect(cell.getColumnAsLetter()).toBe("B");
    });

    test("should get column letter for column number greater than 26", () => {
        const bigCell = new (class extends ACell {
            constructor(row: number, column: number, spreadsheet: Spreadsheet) {
                super(row, column, spreadsheet);
            }
            getValue(): number | string {
                return 0;
            }
            setValue(value: string | number): void {}
            setFormula(formula: string): ICell {
                return this
            }
            getFormula(): string {
                return "";
            }
            getErrorMessage(): string | null {
                return null;
            }
        })(1, 27, spreadsheet);
        expect(bigCell.getColumnAsLetter()).toBe("AB");
    });

    test("should get empty string for column number equal to 0", () => {
        const zeroCell = new (class extends ACell {
            constructor(row: number, column: number, spreadsheet: Spreadsheet) {
                super(row, column, spreadsheet);
            }
            getValue(): number | string {
                return 0;
            }
            setValue(value: string | number): void {}
            setFormula(formula: string): ICell {
                return this
            }
            getFormula(): string {
                return "";
            }
            getErrorMessage(): string | null {
                return null;
            }
        })(1, 0, spreadsheet);
        expect(zeroCell.getColumnAsLetter()).toBe("A");
    });

    test("should get column letter for column number 1", () => {
        const oneCell = new (class extends ACell {
            constructor(row: number, column: number, spreadsheet: Spreadsheet) {
                super(row, column, spreadsheet);
            }
            getValue(): number | string {
                return 0;
            }
            setValue(value: string | number): void {}
            setFormula(formula: string): ICell {
                return this
            }
            getFormula(): string {
                return "";
            }
            getErrorMessage(): string | null {
                return null;
            }
        })(1, 1, spreadsheet);
        expect(oneCell.getColumnAsLetter()).toBe("B");
    });
});
