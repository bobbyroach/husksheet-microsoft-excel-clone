import PRMenuPopup from "./PRMenuPopup"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Controller from "../../backend/controller/controller"
import User from "../../backend/User"
import Spreadsheet from "../../backend/Spreadsheet"
// @author Robert Roach

describe("PR Menu popup tests", () => {

    const mockController = new Controller()
    const dummyUser = new User("Publisher1", "")
    const mockSpreadsheet = new Spreadsheet(dummyUser.getUserName(), "Sheet1", 1, 1)
    const spreadSheetList = [mockSpreadsheet]

    mockSpreadsheet.getSubscriptionUpdates = jest.fn().mockReturnValue([
        ['Update 1', 'Update 2'],
        ['Update 3', 'Update 4'],
      ])

    mockController.excecuteRequest = jest.fn();
    mockController.getModel = jest.fn().mockReturnValue({
        getSubscriptionUpdates: jest.fn().mockReturnValue([
            ['Update 1', 'Update 2'],
            ['Update 3', 'Update 4'],
        ]),
    })

    const handleTogglePRPopup = jest.fn()

    // Tests getUpdates function 
    test("Test that component renders and displays updates", async () => {
        render(<PRMenuPopup
            controller={mockController}
            handleTogglePRPopup={handleTogglePRPopup}
            PRIndex={0}
            spreadSheetList={spreadSheetList}
            user={dummyUser}
        />)
        expect(await screen.findByText('Pull Requests')).toBeInTheDocument()
        const approveButtons = await screen.findAllByText('Approve Updates')
        expect(approveButtons[0]).toBeInTheDocument()

        expect(screen.getByText('$A1 = fake update - feature not implemented'))
          .toBeInTheDocument()
    })

    // Tests handleApproveSubscription function
    test('Approve subscription button calls controller function', async () => {

        render(
            <PRMenuPopup
                controller={mockController}
                handleTogglePRPopup={handleTogglePRPopup}
                PRIndex={0}
                spreadSheetList={[mockSpreadsheet]}
                user={dummyUser}
            />)

        const approveButtons = await screen.findAllByText('Approve Updates')
        await userEvent.click(approveButtons[0])

        expect(mockController.excecuteRequest).toHaveBeenCalled()
    })

    // Tests getUpdates error catching
    test('handles errors getting subscription updates correctly', async () => {
        mockController.excecuteRequest = jest.fn().mockRejectedValue(
          new Error('Error'))
    
        render(
          <PRMenuPopup
            controller={mockController}
            handleTogglePRPopup={handleTogglePRPopup}
            PRIndex={0}
            spreadSheetList={[mockSpreadsheet]}
            user={dummyUser}
          />)
        expect(await screen.findByText('Error getting subscription updates')).toBeInTheDocument()
    })

    // Tests handleApproveSubscription error catching
    test('handles errors approving subscription updates', async () => {
        mockController.excecuteRequest = jest.fn().mockResolvedValueOnce(jest.fn()).mockRejectedValue(new Error('Error'))

        render(
            <PRMenuPopup
                controller={mockController}
                handleTogglePRPopup={handleTogglePRPopup}
                PRIndex={0}
                spreadSheetList={[mockSpreadsheet]}
                user={dummyUser}
            />)

        const approveButtons = await screen.findAllByText('Approve Updates')
        await userEvent.click(approveButtons[0])
        
        expect(await screen.findByText('Error setting published update')).toBeInTheDocument()
    })

    test('closes the modal when clicking the background', async () => {
        render(
          <PRMenuPopup
            controller={mockController}
            handleTogglePRPopup={handleTogglePRPopup}
            PRIndex={0}
            spreadSheetList={[mockSpreadsheet]}
            user={dummyUser}
          />
        )
    
        const modalBackground = document.querySelector('.modal-backdrop') as Element
        await userEvent.click(modalBackground)
    
        expect(handleTogglePRPopup).toHaveBeenCalledWith(0)
      })
})