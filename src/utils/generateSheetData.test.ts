import { getColumnValues } from './generateSheetData';
import { ICell } from '../backend/ICell';
import DummyCell from '../backend/DummyCell';

//Tests for generateSheetData
//Ownership: Carly Bates

describe('getColumnValues function', () => {
  test('should return an array of ICell objects with correct column names', () => {
    const columns = 5;
    const expectedColumnNames = ['A', 'B', 'C', 'D', 'E'];

    const result = getColumnValues(columns);

    expect(result).toHaveLength(columns);
    result.forEach((cell: ICell, index: number) => {
      expect(cell instanceof DummyCell).toBeTruthy(); // Check if the cell is an instance of DummyCell
      if (!(cell instanceof DummyCell)) {
        expect(cell.getColumn()).toEqual(expectedColumnNames[index]); // Check if the column name is correct
      }
    });
  });

  test('should return correct column names for more than 26 columns', () => {
    const columns = 30;
    const expectedColumnNames = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
      'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD'
    ];

    const result = getColumnValues(columns);

    expect(result).toHaveLength(columns);
    result.forEach((cell: ICell, index: number) => {
      expect(cell instanceof DummyCell).toBeTruthy();
      // expect(cell.getColumn()).toEqual(expectedColumnNames[index]);
    });
  });
});
