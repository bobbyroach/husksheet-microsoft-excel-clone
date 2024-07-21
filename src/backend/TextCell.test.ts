import Spreadsheet from './Spreadsheet';
import TextCell from './TextCell';

export {};

//Tests for TextCell
//Ownership: Carly Bates

describe('TextCell', () => {
    let spreadsheet: Spreadsheet;
    let textCell: TextCell;

    beforeEach(() => { //Defines user, spreadsheet, and textCell for tests to work with
        spreadsheet = new Spreadsheet('publisher name', 'sheet name', 30, 50);
        textCell = new TextCell(10, 10, 'input', spreadsheet);
    });

    test('should return the value of a text cell', () => { 
        expect(textCell.getValue()).toBe('input'); //Check if function returns the correct text value
    });

    test('should set the value of a text cell', () => {
        textCell.setFormula('Hello world');
        expect(textCell.getValue()).toBe('Hello world'); //Check if function returns the correct text value
        textCell.setFormula('New value');
        expect(textCell.getValue()).toBe('New value'); //Check if function returns the newly reassigned text value
    });
});