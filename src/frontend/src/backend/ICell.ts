//Interface for all cells
// Ownership: Aneesh Ponduru
export interface ICell {
    /**
     * Returns the row of the cell
     */
    getRow(): number;

    /**
     * Returns the column of the cell
     */
    getColumn(): number;

    /**
     * Returns the value of the cell
     */
    getValue(): string | number;

    /**
     * Get the column number of the cell as a letter
     */
    getColumnAsLetter(): string;

    /**
     * Sets the value of the cell
     * @param value - The value to set in the cell
     */
    setValue(value: string | number): void;

    /**
     * Gets the formula for a cell
     */
    getFormula(): string;

    /**
     * Gets the error message of a string
     */
    getErrorMessage(): string | null;

    /**
     * Sets the formula for a cell
     * @param formula - string representing inputted formula
     */
    setFormula(formula: string): ICell;

    /**
     * Returns the ID of the spreadsheet that the cell belongs to
     */
    getSpreadSheetID(): string;
}