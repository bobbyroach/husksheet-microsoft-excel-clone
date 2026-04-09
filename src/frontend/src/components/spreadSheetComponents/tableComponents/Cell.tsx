import React, { useCallback, useEffect, useState } from 'react';
import { ICell } from '../../../backend/ICell';
// @author Robert Roach

interface CellProps {
    changeSelectedCell: (cell: ICell) => void
    cell: ICell,
    columnWidth: number,
    handleCellChange: (cell: ICell, value: string) => void
    handleMouseDown: (index: number, event: React.MouseEvent) => void
    xCoord: number,
    yCoord: number,
}

const Cell: React.FC<CellProps> = ({ changeSelectedCell, cell, columnWidth, handleCellChange, handleMouseDown, xCoord, yCoord }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [inputValue, setInputValue] = useState(cell.getValue().toString());

    const handleClick = () => {
        changeSelectedCell(cell)
        setIsEditing(true)
    }

    // No longer editing a cell
    const handleBlur = () => {
        setIsEditing(false)
    }

    /**
     * Handle a change to cell input value, which updates the state and then
     * separately updates the cell's value in the overall table array of cells
     */
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        setInputValue(newValue.toString())
        handleCellChange(cell, newValue)
    }, [handleCellChange, cell])

    // Everytime this cell changes, recieve its value and set it in state
    useEffect(() => {
        setInputValue(String(cell.setFormula(cell.getFormula()).getFormula()))
    }, [cell, isEditing])

    // Top left corner cell, not editable
    if (xCoord === 0 && yCoord === 0) {
        return <div className='corner-cell' />;
    }
    // Index cells on lefthand side, not editable
    else if (xCoord === 0) {
        return <div className={`index-cell`}>
            {cell.getValue()}
        </div>
    }
    // Header cells with letter column names, not editable
    else if (yCoord === 0) {
        return (
            <div className='header-cell' style={{ width: `${columnWidth}px` }}>
                <div className="column-cell-text">{cell.getValue()}</div>
                {/* Element that handles resizing columns */}
                <div
                    className="resizer"
                    onMouseDown={(e) => handleMouseDown(xCoord, e)}
                />
            </div>)
    } else {
        // Regular cells
        if (xCoord === 0 && yCoord === 3) {
            console.log(cell.setFormula(cell.getFormula()).getValue())
        }
        return isEditing ? (
            <input
                className="cell"
                onBlur={handleBlur}
                onChange={handleChange}
                style={{ width: `${columnWidth}px` }}
                value={inputValue}
                autoFocus
            />
        ) : (
            <div
                className="cell cell-div"
                onClick={handleClick}
                style={{ width: `${columnWidth}px` }}
            >
                {String(cell.setFormula(cell.getFormula()).getValue())}
            </div>
        )
    }
}

export default Cell