import DashboardHeader from "./DashboardHeader"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import User from "../../backend/User"
// @author Robert Roach

describe("Dashboard header tests", () => {

    const dummyUser = new User("Publisher1", "")
    const updateCurrentUser = jest.fn()

    test("Test that component renders", () => {
        render(<BrowserRouter>
            <DashboardHeader updateCurrentUser={updateCurrentUser} user={dummyUser} />
        </BrowserRouter>)

        expect(screen.getByText("AARCS Husksheets Dashboard")).toBeInTheDocument()
    })

    // Tests updateCurrentUser function prop
    test("Test that component renders", async () => {
        render(<BrowserRouter>
            <DashboardHeader updateCurrentUser={updateCurrentUser} user={dummyUser} />
        </BrowserRouter>)

        const logoutButton = screen.getByText("Logout")
        await userEvent.click(logoutButton)
        expect(updateCurrentUser).toHaveBeenCalled()
    })
})