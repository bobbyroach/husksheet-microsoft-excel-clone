import SpreadSheetEditor from "./SpreadSheetEditor"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import User from "../backend/User"
import Controller from "../backend/controller/controller"
import Spreadsheet from "../backend/Spreadsheet"
import { BrowserRouter } from "react-router-dom"
// @author Robert Roach

describe("Spreadsheet editor page tests", () => {

    const dummyUser = new User("Publisher1", "")
    const mockSpreadsheet = new Spreadsheet(dummyUser.getUserName(), "Sheet1", 1, 1)
    const mockController = new Controller()
    const updateCurrentUser = jest.fn()

    mockController.excecuteRequest = jest.fn().mockReturnValue({
        getUpdatesForPublished: jest.fn().mockReturnValue([
            ['Update 1', 'Update 2'],
            ['Update 3', 'Update 4'],
        ])
    })

    test("Test spreadsheet editor page renders sheet name", async () => {
        render(<BrowserRouter>
            <SpreadSheetEditor
                controller={mockController}
                spreadsheet={mockSpreadsheet}
                updateCurrentUser={updateCurrentUser}
                user={dummyUser}
            />
          </BrowserRouter>)

        expect(await screen.findByText("Sheet1")).toBeInTheDocument()
        // Gets published updates via controller
        expect(mockController.excecuteRequest).toHaveBeenCalled()
    })

    // Tests handleCellChange and changeSelected cell methods
    test("Test setting published updates from changing a cell", async () => {

        // Set a cell's value to retrieve later
        mockSpreadsheet.getCell(0, 0).setFormula("first cell")

        render(<BrowserRouter>
            <SpreadSheetEditor
                controller={mockController}
                spreadsheet={mockSpreadsheet}
                updateCurrentUser={updateCurrentUser}
                user={dummyUser}
            />
          </BrowserRouter>)

        const firstCell = await screen.findByText("first cell")
        await userEvent.click(firstCell)

        // Wait for selected div to turn into input
        const firstCellAsInput = await screen.findAllByDisplayValue("first cell")
        await userEvent.click(firstCellAsInput[1])
        await userEvent.keyboard(" test")

        // Update published endpoint called via controller
        expect(mockController.excecuteRequest).toHaveBeenCalled()
    })

    test("Empty spreadsheet just renders loading text", async () => {
        render(<BrowserRouter>
            <SpreadSheetEditor
                controller={mockController}
                spreadsheet={null}
                updateCurrentUser={updateCurrentUser}
                user={dummyUser}
            />
        </BrowserRouter>)

        expect(await screen.findByText("Loading...")).toBeInTheDocument()
    })

    // Tests onComponentMount method throwing error
    test("Error getting published updates on mount", async () => {
        mockController.excecuteRequest = jest.fn().mockRejectedValueOnce(
            new Error("Problem loading spreadsheet")
        );

        render(<BrowserRouter>
            <SpreadSheetEditor
                controller={mockController}
                spreadsheet={mockSpreadsheet}
                updateCurrentUser={updateCurrentUser}
                user={dummyUser}
            />
        </BrowserRouter>)

        await waitFor(() => expect(screen.getByText("Problem loading spreadsheet")).toBeInTheDocument());
    })

    describe("Tests for users that aren't spreadsheet publisher", () => {
        const mockSpreadsheet = new Spreadsheet("Other user", "Other sheet", 1, 1)

        // Tests handleUpdateSubscription method
        test("Test making a change and pressing update subscription", async () => {

            // Set a cell's value to retrieve later
            mockSpreadsheet.getCell(0, 0).setFormula("first cell")

            render(<BrowserRouter>
                <SpreadSheetEditor
                    controller={mockController}
                    spreadsheet={mockSpreadsheet}
                    updateCurrentUser={updateCurrentUser}
                    user={dummyUser}
                />
            </BrowserRouter>)

            const firstCell = await screen.findByText("first cell")
            await userEvent.click(firstCell)

            // Wait for selected div to turn into input and test its value
            const firstCellAsInput = await screen.findAllByDisplayValue("first cell")
            await userEvent.click(firstCellAsInput[1])
            await userEvent.keyboard(" test")
            const updatedCell = await screen.findAllByDisplayValue("first cell test")
            expect(updatedCell[1]).toBeInTheDocument()

            const updateSubscriptionButton = await screen.findByText("Update Subscription")
            await userEvent.click(updateSubscriptionButton)

            // Update subscription endpoint called via controller
            expect(mockController.excecuteRequest).toHaveBeenCalled()
        })
    })
})