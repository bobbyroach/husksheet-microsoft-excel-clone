import { fireEvent, render, screen } from "@testing-library/react"
import Cell from "./Cell"
import DummyCell from "../../../backend/DummyCell"
import userEvent from "@testing-library/user-event"
import Spreadsheet from "../../../backend/Spreadsheet"
// @author Robert Roach

describe("Cell tests", () => {
    const user = userEvent
    const spreadSheet = new Spreadsheet("Publisher1", "Dummy Sheet", 1, 1)
    const formulaCell = spreadSheet.getCell(0, 0)

    let dummyCell = new DummyCell('1', 0, 0)
    let columnWidth = 75
    let handleCellChange = jest.fn
    let handleMouseDown = jest.fn(() => { columnWidth = 80 })
    let changeSelectedCell = jest.fn

    test("Test cell in document", async () => {
        render(<Cell 
            cell={dummyCell} 
            changeSelectedCell={changeSelectedCell}
            columnWidth={columnWidth}
            handleCellChange={handleCellChange} 
            handleMouseDown={handleMouseDown}
            xCoord={1} yCoord={1} 
        />)

        const cell = await screen.findByText("1")
        expect(cell).toBeInTheDocument()
    })

    test("Test corner cell", () => {
        render(<Cell 
            cell={dummyCell} 
            changeSelectedCell={changeSelectedCell}
            columnWidth={columnWidth}
            handleCellChange={handleCellChange} 
            handleMouseDown={handleMouseDown}
            xCoord={0} yCoord={0} 
        />)

        const cornerCell = document.querySelector('.corner-cell')
        expect(cornerCell).toBeInTheDocument()
    })

    test("Test index cell", () => {
        render(<Cell 
            cell={dummyCell} 
            changeSelectedCell={changeSelectedCell}
            columnWidth={columnWidth}
            handleCellChange={handleCellChange} 
            handleMouseDown={handleMouseDown}
            xCoord={0} yCoord={1} 
        />)
        const indexCell = document.querySelector('.index-cell')
        expect(indexCell).toBeInTheDocument()
    })

    test("Test header cell", () => {
        render(<Cell 
            cell={dummyCell} 
            changeSelectedCell={changeSelectedCell}
            columnWidth={columnWidth}
            handleCellChange={handleCellChange} 
            handleMouseDown={handleMouseDown}
            xCoord={1} yCoord={0} 
        />)
        const headerCell = document.querySelector('.header-cell') as Element
        expect(headerCell).toBeInTheDocument()

        // Test resizer div inside header cell
        const resizer = document.querySelector('.resizer') as Element
        fireEvent.mouseDown(resizer)
        expect(handleMouseDown).toHaveBeenCalled()
    })

    test("Click formula cell and input value", async () => {
        formulaCell.setFormula("Test")

        render(<Cell 
            cell={formulaCell} 
            changeSelectedCell={changeSelectedCell}
            columnWidth={columnWidth}
            handleCellChange={handleCellChange} 
            handleMouseDown={handleMouseDown}
            xCoord={1} 
            yCoord={1} 
        />)

        const cell = await screen.findByText("Test")
        await user.click(cell)

        // Find input element that was previously a div
        const input = await screen.findByDisplayValue("Test")
        await user.keyboard(" input")
        expect(input).toHaveDisplayValue("Test input")
        await user.tab()
    })
})

