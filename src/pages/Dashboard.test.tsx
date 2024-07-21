import Dashboard from "./Dashboard"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import User from "../backend/User"
import Controller from "../backend/controller/controller"
import Spreadsheet from "../backend/Spreadsheet"
import { BrowserRouter } from "react-router-dom"

describe("Dashboard page tests", () => {

    const dummyUser = new User("Publisher1", "")
    const spreadsheetList = [
        new Spreadsheet(dummyUser.getUserName(), "My sheet", 1, 1),
        new Spreadsheet("Other user", "Other sheet", 1, 1),
    ]
    const controller = new Controller()
    const handleChooseSpreadsheet = jest.fn()
    const handleCreateSpreadsheet = jest.fn()
    const handleDeleteSpreadsheet = jest.fn()
    const updateCurrentUser = jest.fn()

    test("Dashboard page renders", async () => {
        render(<BrowserRouter>
            <Dashboard
                controller={controller}
                handleChooseSpreadsheet={handleChooseSpreadsheet}
                handleCreateSpreadsheet={handleCreateSpreadsheet}
                handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                loading={false}
                spreadSheetList={spreadsheetList}
                updateCurrentUser={updateCurrentUser}
                user={dummyUser}
            />
        </BrowserRouter>)

        expect(await screen.findByText("AARCS Husksheets Dashboard"))
            .toBeInTheDocument()
    })

    // Tests handleTogglePage method
    test("My sheets displays current user's sheets, other sheets displays all other sheets", 
        async () => {
        render(<BrowserRouter>
            <Dashboard
                controller={controller}
                handleChooseSpreadsheet={handleChooseSpreadsheet}
                handleCreateSpreadsheet={handleCreateSpreadsheet}
                handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                loading={false}
                spreadSheetList={spreadsheetList}
                updateCurrentUser={updateCurrentUser}
                user={dummyUser}
            />
        </BrowserRouter>)

        expect(await screen.findByText("My sheet")).toBeInTheDocument()
        expect(screen.queryByText("Other sheet")).not.toBeInTheDocument()

        const otherSheetsButton = screen.getByText("Other sheets")
        await userEvent.click(otherSheetsButton)
        setTimeout(() => {}, 100)

        // Other sheet displayed instead of my sheets
        expect(await screen.findByText("Other sheet")).toBeInTheDocument()
        expect(screen.queryByText("My sheet")).not.toBeInTheDocument()
    })

    // Tests handleTogglePopupModal and createSpreadsheet methods
    test("Works through making a new spreadsheet from the dashboard page",
        async () => {
            render(<BrowserRouter>
                <Dashboard
                    controller={controller}
                    handleChooseSpreadsheet={handleChooseSpreadsheet}
                    handleCreateSpreadsheet={handleCreateSpreadsheet}
                    handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                    loading={false}
                    spreadSheetList={spreadsheetList}
                    updateCurrentUser={updateCurrentUser}
                    user={dummyUser}
                />
            </BrowserRouter>)

        const createNewSheetButton = screen.getByText("Create Spreadsheet")
        await userEvent.click(createNewSheetButton)

        const nameInput = await screen.findByPlaceholderText("Name")
        await userEvent.click(nameInput)
        await userEvent.keyboard("Sheet1")

        const createNewButton = await screen.findByText("Create new spreadsheet")
        await userEvent.click(createNewButton)

        expect(handleCreateSpreadsheet).toHaveBeenCalled()
    })

    // Tests handleTogglePRPopup method
    test("Tests opening a pull request menu for a spreadsheet", async () => {
        render(<BrowserRouter>
            <Dashboard
                controller={controller}
                handleChooseSpreadsheet={handleChooseSpreadsheet}
                handleCreateSpreadsheet={handleCreateSpreadsheet}
                handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                loading={false}
                spreadSheetList={spreadsheetList}
                updateCurrentUser={updateCurrentUser}
                user={dummyUser}
            />
        </BrowserRouter>)

        const viewPRButton = await screen.findByText("View Update Requests")
        userEvent.click(viewPRButton)

        // PR menu opened
        expect(await screen.findByText("Pull Requests")).toBeInTheDocument()
    })
})