import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Login from "./Login"
import User from "../backend/User"
// @author Robert Roach

describe("Login page tests", () => {

    const updateCurrentUser = jest.fn()
    const dummyUser = new User("team14", "awWDbpuM&1ZiUkR")

    test("Test username input", async () => {
        render(<Login updateCurrentUser={updateCurrentUser} user={dummyUser} />)

        const usernameInput = await screen.findByPlaceholderText("Username")
        expect(usernameInput).toBeInTheDocument()

        // Inputting value in username input field changes the input field's text
        await userEvent.click(usernameInput)
        await userEvent.keyboard("Bob")
        expect(await screen.findByDisplayValue("Bob")).toBeInTheDocument()
    })

    test("Test password input", async () => {
        render(<Login updateCurrentUser={updateCurrentUser} user={dummyUser} />)

        const passwordInput = await screen.findByPlaceholderText("Password")
        expect(passwordInput).toBeInTheDocument()

        // Inputting value in password input field changes the input field's text
        await userEvent.click(passwordInput)
        await userEvent.keyboard("Password123")
        expect(await screen.findByDisplayValue("Password123")).toBeInTheDocument()
    })

    // Tests handleLogin method
    test("Handle valid login", async () => {
        render(<Login updateCurrentUser={updateCurrentUser} user={null} />)

        const usernameInput = await screen.findByPlaceholderText("Username")
        await userEvent.click(usernameInput)
        await userEvent.keyboard("team14")

        const passwordInput = await screen.findByPlaceholderText("Password")
        await userEvent.click(passwordInput)
        await userEvent.keyboard("awWDbpuM&1ZiUkR")

        const loginButton = await screen.findByText("Login")
        await userEvent.click(loginButton)
        await waitFor(() => {
            expect(updateCurrentUser).toHaveBeenCalled();
        })
    })

    // Error logging in
    test("Error on invalid login", async () => {

        const updateCurrentUser = jest.fn().mockImplementation(() => {
            throw new Error('Update user failed')
        })

        render(<Login updateCurrentUser={updateCurrentUser} user={null} />)

        const usernameInput = await screen.findByPlaceholderText("Username")
        await userEvent.click(usernameInput)
        await userEvent.keyboard("Bob")

        const passwordInput = await screen.findByPlaceholderText("Password")
        await userEvent.click(passwordInput)
        await userEvent.keyboard("Password123")

        const loginButton = await screen.findByText("Login")
        await userEvent.click(loginButton)

        expect(await screen.findByText("Invalid username or password")).toBeInTheDocument()
    })
})
