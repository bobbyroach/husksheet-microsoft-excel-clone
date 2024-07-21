import { ICell } from "./ICell";
import FormulaCell from "./FormulaCell";
import Spreadsheet from "./Spreadsheet";

//Tests for Spreadsheet
//Ownership: Carly Bates

describe("Spreadsheet", () => {
    let spreadsheet: Spreadsheet;

    beforeEach(() => {
        spreadsheet = new Spreadsheet("test publisher", "test name", 3, 4); // Creating a 3x4 spreadsheet for testing
    });

    test("should initialize with correct dimensions", () => {
        expect(spreadsheet.getRows()).toBe(3);
        expect(spreadsheet.getColumns()).toBe(4);
    });

    test("should return spreadsheet's name and publisher", () => {
        expect(spreadsheet.getSheetName()).toBe("test name");
        expect(spreadsheet.getPublisher()).toBe("test publisher");
    });

    test("should retrieve cell coordinates", () => {
        const cell: ICell = spreadsheet.getCell(1, 2);
        expect(cell.getRow()).toBe(1);
        expect(cell.getColumn()).toBe(2);
    });

    test("should not retrieve cell if coordinates are out of bounds", () => {
        expect(() => {
            spreadsheet.getCell(-1, -1);
        }).toThrow("Tried to load invalid cell coordinates");
    });

    test("should set cell correctly", () => {
        const cell: ICell = new FormulaCell(0, 1, "=A1", spreadsheet);
        spreadsheet.setCell(cell);
        expect(spreadsheet.getCell(0, 1)).toBe(cell);
    });

    test("should return all cells correctly", () => {
        const cells: ICell[][] = spreadsheet.getAllCells();
        expect(cells.length).toBe(3);
        expect(cells[0].length).toBe(4);
    });

    test("should identify formulas correctly", () => {
        expect(spreadsheet.isFormula("=A1")).toBe(true);
        expect(spreadsheet.isFormula("Hello")).toBe(false);
    });

    test("should add and retrieve updates correctly", () => {
        spreadsheet.addUpdate("A1", "Updated Value");
        const updates = spreadsheet.getUpdates();
        expect(updates["A1"]).toBe("Updated Value");
    });

    test("should perform updates correctly", () => {
        spreadsheet.performUpdate("$A1 10");
        const cell: ICell = spreadsheet.getCell(0, 0);
        expect(cell.getValue()).toBe("10");
    });

    test("should handle invalid updates gracefully", () => {
        expect(() => {
            spreadsheet.performUpdate("Invalid Update");
        }).not.toThrow();
    });
});
