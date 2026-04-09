import PopupModal from "./PopupModal"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// @author Robert Roach

describe("Popup modal tests", () => {

    const mockContent = <div>Modal Content</div>
    const mockHandleTogglePopupModal = jest.fn()

    test("Test that component renders with content", () => {
        render(
            <PopupModal 
              content={mockContent} 
              handleTogglePopupModal={mockHandleTogglePopupModal} 
        />)

        expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    // tests popup not closing when clicking inside modal content
    test('Doesnt calls handleTogglePopupModal when content is clicked', async () => {
        render(
            <PopupModal
                content={mockContent}
                handleTogglePopupModal={mockHandleTogglePopupModal}
            />
        )

        // Click on content
        await userEvent.click(document.querySelector('.modal-body') as Element)
        expect(mockHandleTogglePopupModal).not.toHaveBeenCalled()
    })

    // tests handleTogglePopupModal prop function
    test('calls handleTogglePopupModal when backdrop is clicked', async () => {
        render(
          <PopupModal 
            content={mockContent} 
            handleTogglePopupModal={mockHandleTogglePopupModal} 
          />
        )
    
        // Click on the backdrop
        await userEvent.click(document.querySelector('.modal-backdrop') as Element)
        expect(mockHandleTogglePopupModal).toHaveBeenCalled()
    })
})