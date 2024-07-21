import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Controller from './backend/controller/controller';
import Spreadsheet from './backend/Spreadsheet';
import User from './backend/User';

// Mocking asynchronous requests
jest.mock('./backend/controller/requests/createSheet');
jest.mock('./backend/controller/requests/getSheets');
jest.mock('./backend/controller/requests/deleteSheet');

describe('App Component', () => {

    const mockController = new Controller()
    mockController.excecuteRequest = jest.fn()

    const dummyUser = new User("team14", "awWDbpuM&1ZiUkR")

    mockController.excecuteRequest = jest.fn()
    mockController.getModel = jest.fn().mockReturnValue({
        getPublishers: jest.fn().mockReturnValue([
            dummyUser,
        ]),
    })

    test('renders login page when user is null', async () => {
        render(<MemoryRouter initialEntries={['/?']}>
                <App />
            </MemoryRouter>)
        
        const loginTitle = await screen.findByText("Login");
        expect(loginTitle).toBeInTheDocument();
    })

    test('renders dashboard page when user is successfully logged in', async () => {
        render(<MemoryRouter initialEntries={['/?', '/']}>
            <App />
        </MemoryRouter>)

        const usernameInput = await screen.findByPlaceholderText("Username")
        await userEvent.click(usernameInput)
        await userEvent.keyboard("team14")
        const passwordInput = await screen.findByPlaceholderText("Password")
        await userEvent.click(passwordInput)
        await userEvent.keyboard("awWDbpuM&1ZiUkR")

        const loginButton = await screen.findByText("Login")
        await userEvent.click(loginButton)

        // Wait for dashboard
        expect(await screen.findByText("AARCS Husksheets Dashboard")).toBeInTheDocument()
    })

    describe("Dashboard page tests", () => {

        // Mock the executeRequest method of Controller
        const mockExecuteRequest = jest.fn()
        Controller.prototype.excecuteRequest = mockExecuteRequest

        Controller.prototype.getModel = jest.fn().mockReturnValue({
            getSpreadsheets: jest.fn().mockReturnValue([
                new Spreadsheet(dummyUser.getUserName(), 'New sheet', 1, 1),
            ]),
            getPublishers: jest.fn().mockReturnValue([
                dummyUser,
            ])
        })

        beforeEach(async () => {
            // Render the app and log in the user before running dashboard tests
            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )
            await userEvent.click(await screen.findByPlaceholderText("Username"))
            await userEvent.keyboard("team14")
            await userEvent.click(await screen.findByPlaceholderText("Password"))
            await userEvent.keyboard("awWDbpuM&1ZiUkR")
            await userEvent.click(await screen.findByText("Login"))
            expect(await screen.findByText("AARCS Husksheets Dashboard")).toBeInTheDocument()
        })

        // Tests handleCreateSpreadsheet
        test("Test creating a new spreadsheet", async () => {

            const createSheetButton = await screen.findByText("Create Spreadsheet")
            await userEvent.click(createSheetButton)

            // Create sheet popup works
            expect(await screen.findByText("New Spreadsheet")).toBeInTheDocument()
            const nameInput = await screen.findByPlaceholderText("Name")
            await userEvent.click(nameInput)
            await userEvent.keyboard("New spreadsheet")

            // Click create sheet
            const createButton = screen.getByText("Create new spreadsheet")
            await userEvent.click(createButton)

            expect(mockExecuteRequest).toHaveBeenCalled()
        })

        // Tests handleDeleteSpreadsheet
        test("Test creating a new spreadsheet", async () => {
            // Verify sheet is rendered to delete
            expect(await screen.findByText("New sheet")).toBeInTheDocument()

            const deleteSheetButton = await screen.findByText("Delete")
            await userEvent.click(deleteSheetButton)

            expect(mockExecuteRequest).toHaveBeenCalled()
        })

        // Tests handleChooseSpreadsheet
        test("Test choosing a spreadsheet", async () => {
            const sheetLink = await screen.findByText("New sheet")
            await userEvent.click(sheetLink)

            // Verify making it to spreadsheet page
            expect(await screen.findByText("Selected cell")).toBeInTheDocument()
        })

        // Tests updateCurrentUser
        test("Test logging out", async () => {
            const logoutButton = await screen.findByText("Logout")
            await userEvent.click(logoutButton)

            // Verify going back to login page
            expect(await screen.findByText("Husksheets Login")).toBeInTheDocument()
        })
    })
})
