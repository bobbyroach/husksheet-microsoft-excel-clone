import { ICell } from "./ICell";
import Spreadsheet from "./Spreadsheet";
import ACell from "./ACell";
import { parse } from "path";
import { validateHeaderValue } from "http";
import FormulaParser from "./FormulaParser";

// Cells that contain a formula
// Ownership: Aneesh Ponduru
class FormulaCell extends ACell implements ICell {

    private formula: string                 // The formula of the cell
    private value: number | string | null   // The value of the cell
    private validFormula: boolean           // Whether the formula is valid
    private errorMessage: string            // The error message of the cell
    private formulaParser: FormulaParser    // Formula parser instance

    constructor(row: number, column: number, formula: string, spreadsheet: Spreadsheet) {
        super(row, column, spreadsheet)
        this.formula = formula
        this.value = null
        this.validFormula = false
        this.errorMessage = ""
        this.formulaParser = new FormulaParser(this.spreadsheet) // Create a new formula parser using the spreadsheet
    }

    /**
     * Returns the row of the cell
     * @returns The row of the cell
     */
    getColumn(): number {
        return this.column;
    }

    /**
     * Returns the column of the cell
     * @returns The column of the cell
     */
    getRow(): number {
        return this.row;
    }

    /**
     * Returns the value of the cell
     * @returns The value of the cell
     */
    getValue(): number | string {
        return this.value ?? this.errorMessage
    }

    /**
     * Returns the formula of the cell
     * @returns The formula of the cell
     */
    getFormula(): string {
        return this.formula
    }

    /**
     * Sets the formula of the cell
     * @param formula The new formula of the cell
     */
    setFormula(formula: string): ICell {
        this.formula = formula      // Set the formula

        if (this.formula.charAt(0) === '=') {
            try {
                // If copy formula, only display formula and set value to formula
                if (this.formula.substring(1, 5) === 'COPY') {
                    this.evaluateFormula(this.formula.substring(1))
                    this.value = this.formula
                } else {
                    // Evaluate the formula and set the value
                    this.value = this.evaluateFormula(this.formula.substring(1));
                }
                this.errorMessage = ""

                // If the value is a boolean, convert it to a string
                if (typeof this.value === 'boolean') {
                    this.value = String(this.value)
                }

            } catch (error) {
                // If there is an error, set the error message and return the formula
                this.value = null
                let errorMessage = error instanceof Error ? error.message : String(error)
                this.errorMessage = errorMessage
            }
        } else {
            this.formula = formula
            this.value = formula
        }
        return this
    }

    /**
     * Returns the error message of the cell
     * @returns The error message of the cell
     */
    getErrorMessage(): string | null {
        const errorMessage = this.errorMessage !== '' ? this.errorMessage : null
        return errorMessage;
    }

    /**
     * Evaluates the formula and returns the result as a number or throw error if the function is invalid.
     * @private
     */
    private evaluateFormula(formula: string): number | string {
        try {
            // Parse the formula and return the result
            return this.formulaParser.parseFormula(this, formula)
        } catch (error) {
            console.error("Error evaluating formula: ", error);
            throw error
        }
    }

    /**
     * Sets the value of the cell
     * @param value - The new value of the cell
     */
    setValue(value: string | number): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Returns the ID of the spreadsheet that the cell belongs to
     * @returns The ID of the spreadsheet
     * @public
     */
    getSpreadSheetID(): string {
        return this.spreadsheet.getID();
    }

} export default FormulaCell;
