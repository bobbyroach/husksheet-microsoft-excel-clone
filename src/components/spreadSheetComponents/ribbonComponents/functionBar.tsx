import Dropdown from "./Dropdown";
import { Functions } from "../../../utils/types";
import './ribbonCSS/functionRow.css'
import { ICell } from "../../../backend/ICell";
import { FC, useEffect, useState } from "react";
// @author Robert Roach

interface FunctionBarProps {
    handleFunctionInput: (cell: ICell | null, input: string) => void 
    tableData: ICell[][],
    selectedCell: ICell | null,
}

const FunctionBar: FC<FunctionBarProps> = ({ handleFunctionInput, selectedCell, tableData }) => {

    const [error, setError] = useState<string | null>(null)

    // Updates the error message when function input changes
    useEffect(() => {
        if (selectedCell)
            setError(selectedCell.getErrorMessage())
    }, [selectedCell, handleFunctionInput, tableData])

    const functionList = [Functions.SUM, Functions.IF, Functions.MIN, Functions.MAX, Functions.AVG, Functions.CONCAT, Functions.DEBUG, Functions.COPY]

    return (
        <div className="function-row">
            <div className="selected-cell function-row-boxes" >
                {selectedCell !== null
                    ? selectedCell.getColumnAsLetter() + (selectedCell.getRow() + 1)
                    : 'Selected cell'}
            </div>
            <Dropdown
                buttonLabel={'Functions'}
                listItems={functionList}
            />
            <div className="function-input-wrapper">
                {error && <div className="error-tooltip">
                    <p>!</p>
                    <div className="error-message">{error}</div>
                </div>}
                <input
                    className={`function-input function-row-boxes ${error && 'activeError'}`}
                    onChange={(e) => handleFunctionInput(selectedCell, e.target.value)}
                    value={selectedCell !== null ? selectedCell.getFormula() : ""}
                />
            </div>
        </div>
    )

}

export default FunctionBar