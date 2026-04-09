import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import User from "../../backend/User"
import Controller from "../../backend/controller/controller"
import Spreadsheet from "../../backend/Spreadsheet"
import { BrowserRouter } from "react-router-dom"
import MySheetsList from "./MySheetsList"
// @author Robert Roach

describe("My sheets list tests", () => {

    const dummyUser = new User("Publisher1", "")
    const mockController = new Controller()
    const mockSpreadsheet = new Spreadsheet(dummyUser.getUserName(), "Sheet1", 1, 1)
    const spreadSheetList = [mockSpreadsheet]

    const pRDropdownsOpen = [false]

    const handleChooseSpreadsheet = jest.fn()
    const handleDeleteSpreadsheet = jest.fn()
    let handleTogglePRPopup = jest.fn()

    test("Test that component renders out spreadsheet list", async () => {

        render(<BrowserRouter>
            <MySheetsList
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
            <MySheetsList
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
            <MySheetsList
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

    // Tests handleTogglePRPopup function prop
    test("Test opening subscription updates for a spreadsheet", async () => {
        render(<BrowserRouter>
            <MySheetsList
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

        const viewUpdatesButton = await screen.findByText("View Update Requests")
        await userEvent.click(viewUpdatesButton)

        expect(handleTogglePRPopup).toHaveBeenCalled()
    })

    // Tests handleDeleteSpreadsheet function prop
    test("Test opening subscription updates for a spreadsheet", async () => {
        render(<BrowserRouter>
            <MySheetsList
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

        const deleteButton = await screen.findByText("Delete")
        await userEvent.click(deleteButton)

        expect(handleDeleteSpreadsheet).toHaveBeenCalled()
    })

    // Tests conditional rendering of PRMenuPopup component
    test("Test view pullrequest popup is open", async () => {
        pRDropdownsOpen[0] = true

        render(<BrowserRouter>
            <MySheetsList
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

        // Test pull requests popup is opened
        expect(await screen.findByText("Pull Requests")).toBeInTheDocument()
    })
})