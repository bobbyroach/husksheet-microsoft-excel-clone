import FunctionBar from "./functionBar"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Spreadsheet from "../../../backend/Spreadsheet"
import User from "../../../backend/User"
// @author Robert Roach

describe("Function bar tests", () => {

    const dummyUser = new User("Publisher1", "")
    const spreadsheet = new Spreadsheet(dummyUser.getUserName(), "Sheet1", 5, 5)
    const handleFunctionInput = jest.fn()

    test("Test that component renders", async () => {

        render(<FunctionBar 
            handleFunctionInput={handleFunctionInput}
            selectedCell={null}
            tableData={spreadsheet.getAllCells()} 
        />)

        expect(await screen.findByText("Selected cell")).toBeInTheDocument()
    })

    // Tests handleCellChange prop
    test("Function bar input called handleCellChange", async () => {

        const selectedCell = spreadsheet.getCell(0, 0)
        selectedCell.setFormula('initial cell value')

        render(<FunctionBar 
            handleFunctionInput={handleFunctionInput}
            selectedCell={selectedCell}
            tableData={spreadsheet.getAllCells()} 
        />)

        const functionBar = await screen.findByDisplayValue("initial cell value")
        await userEvent.click(functionBar)
        await userEvent.keyboard("addition")
        expect(handleFunctionInput).toHaveBeenCalled()
    })
})