import './dashboardCSS/popups.css'
// @author Robert Roach

interface PopupModalProps {
    content: React.ReactNode,
    handleTogglePopupModal: () => void,
}

// Reuseable popup modal
const PopupModal: React.FC<PopupModalProps> = ({ content, handleTogglePopupModal }) => {

    return (
        <div className='modal-backdrop' onClick={() => handleTogglePopupModal()}>
            <div className='modal-body' onClick={(e) => e.stopPropagation()}>
                {content}
            </div>
        </div>
    )
}

export default PopupModal