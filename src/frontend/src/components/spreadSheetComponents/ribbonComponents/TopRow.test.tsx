import TopRow from "./TopRow"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import User from "../../../backend/User"
import Spreadsheet from "../../../backend/Spreadsheet"
import { BrowserRouter } from "react-router-dom"
// @author Robert Roach

describe("Top row spreadsheet tests", () => {

    const dummyUser = new User("Publisher1", "")
    const spreadsheet = new Spreadsheet(dummyUser.getUserName(), "Sheet1", 5, 5)
    const handleUpdateSubscription = jest.fn()
    const updateCurrentUser = jest.fn()

    test("Test that component renders", async () => {

        render(<BrowserRouter>
                <TopRow
                    handleUpdateSubscription={handleUpdateSubscription}
                    spreadsheet={spreadsheet}
                    user={dummyUser}
                    updateCurrentUser={updateCurrentUser}
                />
            </BrowserRouter>)

        expect(await screen.findByText("Sheet1")).toBeInTheDocument()
    })

    // Tests updateCurrentUser function prop
    test("Logout button", async () => {
        render(<BrowserRouter>
            <TopRow
                handleUpdateSubscription={handleUpdateSubscription}
                spreadsheet={spreadsheet}
                user={dummyUser}
                updateCurrentUser={updateCurrentUser}
            />
        </BrowserRouter>)

        const logoutButton = await screen.findByText("Logout")
        await userEvent.click(logoutButton)

        // Updates current user to null on logout
        expect(updateCurrentUser).toHaveBeenCalledWith(null)
    })

    // // Tests toggleAutoUpdates function
    // test("Test auto updates button when user is publisher", async () => {
    //     render(<BrowserRouter>
    //         <TopRow
    //             handleUpdateSubscription={handleUpdateSubscription}
    //             spreadsheet={spreadsheet}
    //             user={dummyUser}
    //             updateCurrentUser={updateCurrentUser}
    //         />
    //     </BrowserRouter>)

    //     const autoUpdatesButton = await screen.findByText("Enable Auto Updates")
    //     await userEvent.click(autoUpdatesButton)

    //     // Button changes to say 'disable' when clicking enable auto updates
    //     expect(await screen.findByText("Disable Auto Updates")).toBeInTheDocument()
    // })

    // Test updateSubscription function prop
    test("Update subscription button when not the publisher of spreadsheet", async () => {
        const nonPublisherUser = new User("Editor", "")
    
        render(<BrowserRouter>
            <TopRow
                handleUpdateSubscription={handleUpdateSubscription}
                spreadsheet={spreadsheet}
                user={nonPublisherUser}
                updateCurrentUser={updateCurrentUser}
            />
        </BrowserRouter>)

        const updateSubButton = await screen.findByText("Update Subscription")
        await userEvent.click(updateSubButton)

        expect(handleUpdateSubscription).toHaveBeenCalled()
    })

    test("Update subscription button not visible when auto updates enabled for spreadsheet", 
        async () => {
        const nonPublisherUser = new User("Editor", "")
        spreadsheet.setAutoUpdates(true)

        render(<BrowserRouter>
            <TopRow
                handleUpdateSubscription={handleUpdateSubscription}
                spreadsheet={spreadsheet}
                user={nonPublisherUser}
                updateCurrentUser={updateCurrentUser}
            />
        </BrowserRouter>)

        // Button not visible when auto updates are on
        const updateSubButton = screen.queryByText("Update Subscription")
        expect(updateSubButton).not.toBeVisible()
    })
})