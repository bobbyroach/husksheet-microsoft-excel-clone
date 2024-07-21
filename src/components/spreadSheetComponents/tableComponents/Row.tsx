import React, { Component } from 'react'
import Cell from './Cell'
import { ICell } from '../../../backend/ICell'
import DummyCell from '../../../backend/DummyCell'
import { arraysDifferent } from '../../../utils/arraysDifferent'
// @author Robert Roach

interface RowProps {
    changeSelectedCell: (cell: ICell) => void
    columnWidths: number[],
    handleCellChange: (cell: ICell, value: string) => void
    handleMouseDown: (index: number, event: React.MouseEvent) => void
    cellRow: ICell[],
    rowIndex: number,
}

interface RowState {
    prevCellRow: (string | number)[],
    prevColumnWidths: number[],
}

class Row extends Component<RowProps, RowState> {
    constructor(props: RowProps) {
        super(props)
        this.state = {
            prevColumnWidths: props.columnWidths.slice(),
            prevCellRow: []
        }
    }

    shouldComponentUpdate(nextProps: RowProps): boolean {
        // Checks if any element in rowData or column widths has changed
        if (
            arraysDifferent(
                nextProps.cellRow.map(val => val.setFormula(val.getFormula()).getValue()), 
                this.state.prevCellRow
            ) 
            || arraysDifferent(nextProps.columnWidths, this.state.prevColumnWidths)
        ) {
            this.updatePrevData()
            return true
        }
        return false
    } 
 
    /**
     * If the component does update, this row's cell data has been changed
     * and the previous state values must be updated for future comparisons.
     */
    updatePrevData(): void {
        this.setState({ prevCellRow: this.props.cellRow.map(val => val.setFormula(val.getFormula()).getValue()) })
        this.setState({ prevColumnWidths: this.props.columnWidths.slice() })
    }

    render() {
        const { changeSelectedCell, columnWidths, handleCellChange, handleMouseDown, cellRow, rowIndex } = this.props

        // Add y column row indices and keep first row blank (top left square)
        const cellRowWithIndex = rowIndex !== 0 
            ? [new DummyCell(String(rowIndex), rowIndex, 0), ...cellRow] 
            : [new DummyCell("", 0, 0), ...cellRow]


        return (
            <div className={`row ${rowIndex === 0 ? 'column-row' : ''}`}>
                {cellRowWithIndex.map((cell, cellIndex) => {
                    return <Cell
                        cell={cell}
                        changeSelectedCell={changeSelectedCell}
                        columnWidth={columnWidths[cellIndex]}
                        handleCellChange={handleCellChange}
                        handleMouseDown={handleMouseDown}
                        key={cellIndex}
                        xCoord={cellIndex}
                        yCoord={rowIndex}
                    />
                })}
            </div>
        )
    }
}

export default Row