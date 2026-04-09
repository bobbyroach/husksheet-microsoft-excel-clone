import { ICell } from '../backend/ICell';
import DummyCell from '../backend/DummyCell';
// Ownership: Robert Roach

const alphabetList = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z'
]

// Logic to create column names like A, B, C, ... AA, AB, AC, ...
export function getColumnValues(columns: number): ICell[] {
    let columnValues = new Array(columns)

    for (let i = 0; i < columns; i++) {
        if (i < 26) {
            columnValues[i] = new DummyCell(alphabetList[i], 0, i)
        }
        else {
            columnValues[i] = new DummyCell(alphabetList[Math.floor((i - 26) / 26)] + alphabetList[i % 26], 0, i)
        }
    }

    return columnValues
}
