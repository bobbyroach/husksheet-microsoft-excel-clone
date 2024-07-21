import { render, screen, fireEvent } from "@testing-library/react"
import Table from "./Table"
import Spreadsheet from "../../../backend/Spreadsheet"
import User from "../../../backend/User"
import { getColumnValues } from "../../../utils/generateSheetData"
import userEvent from "@testing-library/user-event"
// @author Robert Roach

describe("Table tests", () => {

    let changeSelectedCell = jest.fn()
    let handleCellChange = jest.fn()
    const user =  userEvent

    const dummyUser = new User("Publisher1", "")
    const dummySheet = new Spreadsheet(dummyUser.getUserName(), 'dummy sheet', 1, 2)

    // Make changes to both formula cells in dummySheet to test
    dummySheet.getCell(0, 0).setFormula("3")
    dummySheet.getCell(0, 1).setFormula("4")

    // Mock cell data that is passed into Table.tsx
    const tableData = [getColumnValues(dummySheet.getColumns()), ...dummySheet.getAllCells()]

    test("Test table renders cells in document", async () => {
        render(<Table 
            handleCellChange={handleCellChange}
            tableData={tableData} 
            changeSelectedCell={changeSelectedCell}
        />)
        const cell1 = await screen.findByText("A") // Header cells
        const cell2 = await screen.findByText("B")
        const cell3 = await screen.findByText("3") // Cell inputs
        const cell4 = await screen.findByText("4")

        expect(cell1).toBeInTheDocument()
        expect(cell2).toBeInTheDocument()
        expect(cell3).toBeInTheDocument()
        expect(cell4).toBeInTheDocument()
    })

    test("Resizing a column in table", async () => {

        render(<Table 
            handleCellChange={handleCellChange}
            tableData={tableData} 
            changeSelectedCell={changeSelectedCell}
        />)
        
        const AColumnResizer = document.querySelector(".resizer") as Element
        const initialHeaderWidth = (document.querySelector('.header-cell') as Element).clientWidth

        // Increase width of column
        fireEvent.mouseDown(AColumnResizer, { clientX: 100 })
        fireEvent.mouseMove(document, { clientX: 150 })
        fireEvent.mouseUp(document)

        const updatedHeaderWidth = document.querySelector('.header-cell')?.clientWidth
        expect(updatedHeaderWidth).toBeGreaterThanOrEqual(initialHeaderWidth)
    })

    describe("Testing large table (more than 400 rows)", () => {
    
        // Define a height for React-virtualized List Autosizer to render children
        const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
        const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
      
        beforeAll(() => {
          Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 50 });
          Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 50 });
        });
      
        afterAll(() => {
            if (originalOffsetHeight && originalOffsetWidth) {
                Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
                Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
            }
        });

        const largeDummySheet = new Spreadsheet(dummyUser.getUserName(), 'dummy sheet', 500, 10)

        // Make changes to cell that is rendered in react-virtualized List
        largeDummySheet.getCell(0, 0).setFormula("Rendered")
        // Make changes to cell that is not rendered in List
        largeDummySheet.getCell(450, 0).setFormula("Not rendered")

        // Mock cell data that is passed into Table.tsx
        const tableData = [getColumnValues(largeDummySheet.getColumns()), ...largeDummySheet.getAllCells()]

        test("Test large table rendering", async () => {

            render(
                <Table
                    handleCellChange={handleCellChange}
                    tableData={tableData}
                    changeSelectedCell={changeSelectedCell}
                />
            )

            const renderedCell = await screen.findByText("Rendered")
            expect(renderedCell).toBeInTheDocument()

            const unrenderedCell = screen.queryByText("not rendered")
            expect(unrenderedCell).not.toBeInTheDocument()
        })

        test("Test rowRender method", () => {
            render(<Table
                changeSelectedCell={changeSelectedCell}
                handleCellChange={handleCellChange}
                tableData={tableData}
            />)
    
            const rowElements = document.querySelectorAll('.row')
            expect(rowElements.length).toBe(tableData.length)
        })
    })
})


