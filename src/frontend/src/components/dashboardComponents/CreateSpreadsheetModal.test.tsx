import CreateSpreadsheetModal from "./CreateSpreadsheetModal"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Spreadsheet from "../../backend/Spreadsheet"
import User from "../../backend/User"
// @author Robert Roach

describe("Create spreadsheet popup modal tests", () => {

    const dummyUser = new User("Publisher1", "")
    const mockSpreadsheet = new Spreadsheet(dummyUser.getUserName(), "Sheet1", 1, 1)
    const spreadSheetList = [mockSpreadsheet]

    const handleCreateSpreadsheet = jest.fn()
    const handleTogglePopupModal = jest.fn()
    
    test("Test that component renders", async () => {

        render(<CreateSpreadsheetModal
            handleCreateSpreadsheet={handleCreateSpreadsheet} handleTogglePopupModal={handleTogglePopupModal}
            spreadsheetList={spreadSheetList}
            user={dummyUser}
        />)

        expect(await screen.findByText("New Spreadsheet")).toBeInTheDocument()
    })

    // Tests handleClickCreate function
    test("Filling out input fields and clicking create new sheet", async () => {

        render(<CreateSpreadsheetModal
            handleCreateSpreadsheet={handleCreateSpreadsheet} handleTogglePopupModal={handleTogglePopupModal}
            spreadsheetList={spreadSheetList}
            user={dummyUser}
        />)

        const nameInput = await screen.findByPlaceholderText("Name")
        await userEvent.click(nameInput)
        await userEvent.keyboard("New Sheet")

        const rowInput = await screen.findByPlaceholderText("Rows")
        await userEvent.click(rowInput)
        await userEvent.keyboard("20")    

        const columnInput = await screen.findByPlaceholderText("Columns")
        await userEvent.click(columnInput)
        await userEvent.keyboard("20")

        const createNewButton = await screen.findByText("Create new spreadsheet")
        await userEvent.click(createNewButton)
        expect(handleCreateSpreadsheet).toHaveBeenCalled()
    })

    // Tests error handling on handleClickCreate function
    test("Creating duplicate sheet name with same publisher displays an error", async () => {

        render(<CreateSpreadsheetModal
            handleCreateSpreadsheet={handleCreateSpreadsheet} handleTogglePopupModal={handleTogglePopupModal}
            spreadsheetList={spreadSheetList}
            user={dummyUser}
        />)

        const nameInput = await screen.findByPlaceholderText("Name")
        await userEvent.click(nameInput)
        await userEvent.keyboard("Sheet1")

        const createNewButton = await screen.findByText("Create new spreadsheet")
        await userEvent.click(createNewButton)

        expect(await screen.findByText("Spreadsheet name already exists"))
    })

    test("Not filling out spreadsheet name displays an error", async () => {

        render(<CreateSpreadsheetModal
            handleCreateSpreadsheet={handleCreateSpreadsheet} handleTogglePopupModal={handleTogglePopupModal}
            spreadsheetList={spreadSheetList}
            user={dummyUser}
        />)

        const createNewButton = await screen.findByText("Create new spreadsheet")
        await userEvent.click(createNewButton)

        expect(await screen.findByText("Spreadsheet must have a name"))
    })

    // Tests handleTogglePopupModal prop function
    test("Clicking cancel calls togglePopupModal", async () => {

        render(<CreateSpreadsheetModal
            handleCreateSpreadsheet={handleCreateSpreadsheet} handleTogglePopupModal={handleTogglePopupModal}
            spreadsheetList={spreadSheetList}
            user={dummyUser}
        />)

        const createNewButton = await screen.findByText("Cancel")
        await userEvent.click(createNewButton)

        expect(handleTogglePopupModal).toHaveBeenCalled()
    })
})