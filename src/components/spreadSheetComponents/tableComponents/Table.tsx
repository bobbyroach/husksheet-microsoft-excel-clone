import React, { Component } from 'react'
import './tableComponents.css'
import Row from './Row'
import { ICell } from '../../../backend/ICell'
import { AutoSizer, List, ListRowProps } from 'react-virtualized'
// @author Robert Roach

interface TableProps {
    changeSelectedCell: (cell: ICell) => void
    handleCellChange: (cell: ICell, value: string) => void
    tableData: ICell[][];
}

interface TableState {
    columnWidths: number[],
}

class Table extends Component<TableProps, TableState> {

    constructor(props: TableProps) {
        super(props)
        this.state = {
            columnWidths: new Array(props.tableData.length).fill(90),
        }
        this.handleMouseDown = this.handleMouseDown.bind(this)
    }

    componentDidUpdate(prevProps: TableProps): void {
        // Check if tableData has been updated to update column widths
        if (prevProps.tableData.length === 0 && this.props.tableData.length > 0) {
            this.setState({
                columnWidths: new Array(this.props.tableData[0].length + 1).fill(90)
            })
        }
    }

    /**
     * Function to handle mouse down event on column borders to 
     * increase or decrease column width
     * 
     * @param index : header cell's width to be changed
     * @param event : mouseDown, mouseUp, or mouse movement
     */
    handleMouseDown = (index: number, event: React.MouseEvent): void => {
        event.preventDefault()
        const startX = event.clientX
        const startWidth = this.state.columnWidths[index]

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX)
            this.setState((prevState) => {
                const columnWidths = [...prevState.columnWidths]

                // Set a minimum pixel width
                columnWidths[index] = newWidth > 50 ? newWidth : 50;
                return { columnWidths }
            })
        }
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    /**
     * Renders out the list of rows, used inside of react-virtualized List in render method
     * to only render rows that are currently on screen
     */
    renderRow = ({ index, style }: ListRowProps) => {
        const { changeSelectedCell, handleCellChange } = this.props
        const { columnWidths } = this.state
        const cellRow = this.props.tableData[index]

        return (
            <div key={index} style={style}>
                <Row
                    changeSelectedCell={changeSelectedCell}
                    handleCellChange={handleCellChange}
                    handleMouseDown={this.handleMouseDown}
                    rowIndex={index}
                    cellRow={cellRow}
                    columnWidths={columnWidths}
                />
            </div>
        )
    }

    render() {
        const { changeSelectedCell, handleCellChange, tableData } = this.props
        const { columnWidths } = this.state
        const totalWidth = this.state.columnWidths.reduce((acc, width) => acc + width, 0) - 30

        return (
            <div>
                {tableData[0]?.length < 401 ?
                    <div className='spreadsheet-table'>
                        {tableData.map((cellRow, rowIndex) => {
                            return <Row
                                key={rowIndex}
                                changeSelectedCell={changeSelectedCell}
                                handleCellChange={handleCellChange}
                                handleMouseDown={this.handleMouseDown}
                                rowIndex={rowIndex}
                                cellRow={cellRow}
                                columnWidths={columnWidths}
                            />
                        })}
                    </div>
                    :
                    <div className='large-spreadsheet-table'>
                        <AutoSizer disableWidth>
                            {({ height }) => (
                                <List
                                    columnWidths={columnWidths}
                                    height={height}
                                    rowCount={tableData.length}
                                    rowHeight={22}
                                    rowRenderer={this.renderRow}
                                    tableData={tableData}
                                    style={{ paddingBottom: '30px' }}
                                    overscanRowCount={3}
                                    width={totalWidth}
                                />)}
                        </AutoSizer>
                    </div>}
            </div>
        )
    }
}

export default Table