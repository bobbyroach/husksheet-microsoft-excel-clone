import OtherSheetsList from "./OtherSheetsList"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import User from "../../backend/User"
import Controller from "../../backend/controller/controller"
import Spreadsheet from "../../backend/Spreadsheet"
import { BrowserRouter } from "react-router-dom"
// @author Robert Roach

describe("Other sheets list tests", () => {

    const dummyUser = new User("Publisher1", "")
    const mockController = new Controller()
    const mockSpreadsheet = new Spreadsheet("Other user", "Sheet1", 1, 1)
    const spreadSheetList = [mockSpreadsheet]

    const pRDropdownsOpen = [false]

    const handleChooseSpreadsheet = jest.fn()
    const handleDeleteSpreadsheet = jest.fn()
    const handleTogglePRPopup = jest.fn()

    test("Test that component renders out spreadsheet list", async () => {

        render(<BrowserRouter>
            <OtherSheetsList
                controller={mockController}
                handleChooseSpreadsheet={handleChooseSpreadsheet}
                handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                handleTogglePRPopup={handleTogglePRPopup}
                loading={false}
                pRDropdownsOpen={pRDropdownsOpen}
                spreadSheetList={spreadSheetList}
                user={dummyUser}
            />
        </BrowserRouter>)

        expect(await screen.findByText("Sheet1")).toBeInTheDocument()
    })

    // Tests handleChooseSpreadsheet prop function
    test("Test choosing a spreadsheet", async () => {

        render(<BrowserRouter>
            <OtherSheetsList
                controller={mockController}
                handleChooseSpreadsheet={handleChooseSpreadsheet}
                handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                handleTogglePRPopup={handleTogglePRPopup}
                loading={false}
                pRDropdownsOpen={pRDropdownsOpen}
                spreadSheetList={spreadSheetList}
                user={dummyUser}
            />
        </BrowserRouter>)

        const sheetLink = await screen.findByText("Sheet1")
        await userEvent.click(sheetLink)

        expect(handleChooseSpreadsheet).toHaveBeenCalled()
    })

    test("Test loading stage of component", async () => {
        render(<BrowserRouter>
            <OtherSheetsList
                controller={mockController}
                handleChooseSpreadsheet={handleChooseSpreadsheet}
                handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                handleTogglePRPopup={handleTogglePRPopup}
                loading={true}
                pRDropdownsOpen={pRDropdownsOpen}
                spreadSheetList={spreadSheetList}
                user={dummyUser}
            />
        </BrowserRouter>)

        expect(await screen.findByText("Loading")).toBeInTheDocument()
    })
})