import { render, screen } from "@testing-library/react"
import Row from "./Row"
import DummyCell from "../../../backend/DummyCell"
// @author Robert Roach

describe("Row tests", () => {

    let cellRow = [new DummyCell('2', 0, 0), new DummyCell('3', 0, 0)]
    let handleCellChange = jest.fn
    let handleMouseDown = jest.fn
    let changeSelectedCell = jest.fn
    let rowIndex = 1
    let columnWidths = [50, 50]

    test("Test row in document", async () => {
        
        render(<Row 
            cellRow={cellRow}
            handleCellChange={handleCellChange}
            handleMouseDown={handleMouseDown}
            rowIndex={rowIndex}
            columnWidths={columnWidths} 
            changeSelectedCell={changeSelectedCell}
            />
        )

        const cell1 = await screen.findByText("2")
        const cell2 = await screen.findByText("3")

        expect(cell1).toBeInTheDocument()
        expect(cell2).toBeInTheDocument()
    })
})

