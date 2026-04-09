import NumberCell from "./NumberCell";
import Spreadsheet from "./Spreadsheet";

//Tests for NumberCell
//Ownership: Carly Bates

describe("NumberCell", () => {
    let cell: NumberCell;
    let spreadsheet: Spreadsheet;

    beforeEach(() => {
        spreadsheet = new Spreadsheet("test publisher", "test name", 3, 3);
        cell = new NumberCell(1, 1, 10, spreadsheet);
    });

    test("should initialize with correct row, column, and value", () => {
        expect(cell.getRow()).toBe(1);
        expect(cell.getColumn()).toBe(1);
        expect(cell.getValue()).toBe(10);
    });

    test("should set new value correctly", () => {
        cell.setFormula('20');
        expect(cell.getValue()).toBe(20);
    });

    test("should get spreadsheet ID", () => {
        expect(cell.getSpreadSheetID()).toBe(spreadsheet.getID());
    });
});