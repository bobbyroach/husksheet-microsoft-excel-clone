import DummyCell from './DummyCell';

describe('DummyCell', () => {
    
//Tests for DummyCell
//Ownership: Carly Bates

    describe('getValue', () => {
        test('should return the string value provided in the constructor', () => {
            const dummyValue = 'test string';
            const dummyCell = new DummyCell(dummyValue, 0, 0);
            expect(dummyCell.getValue()).toBe(dummyValue);
        });
    });

    describe('Unimplemented methods', () => {
        test('getRow should return row', () => {
            const dummyCell = new DummyCell('value', 0, 0);
            expect(dummyCell.getRow()).toBe(0);
        });

        test('getColumn should return column', () => {
            const dummyCell = new DummyCell('value', 0, 0);
            expect(dummyCell.getColumn()).toBe(0);
        });

        test('getColumnAsLetter should throw an error when called', () => {
            const dummyCell = new DummyCell('value', 0, 0);
            expect(() => dummyCell.getColumnAsLetter()).toThrowError('Method not implemented.');
        });

        test('setValue should throw an error when called', () => {
            const dummyCell = new DummyCell('value', 0, 0);
            expect(dummyCell.setFormula('new value').getFormula()).toBe("value");
        });

        test('getSpreadSheetID should throw an error when called', () => {
            const dummyCell = new DummyCell('value', 0, 0);
            expect(() => dummyCell.getSpreadSheetID()).toThrowError('Method not implemented.');
        });

        test('getFormula should return value', () => {
            const dummyCell = new DummyCell('value', 0, 0);
            expect(dummyCell.getFormula()).toBe('value');
        });

        test('getErrorMessage should throw an error when called', () => {
            const dummyCell = new DummyCell('value', 0, 0);
            expect(() => dummyCell.getErrorMessage()).toThrowError('Method not implemented.');
        });
    });
});
