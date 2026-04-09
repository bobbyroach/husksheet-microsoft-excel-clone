import { FC, useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import './ribbonCSS/topRow.css'
import User from "../../../backend/User"
import Spreadsheet from "../../../backend/Spreadsheet"
// @author Robert Roach

interface TopRowProps {
    handleUpdateSubscription: (spreadsheet: Spreadsheet | null) => void,
    spreadsheet: Spreadsheet | null,
    updateCurrentUser: (user: User | null) => void,
    user: User,
}

const TopRow: FC<TopRowProps> = ({ handleUpdateSubscription, spreadsheet, updateCurrentUser, user }) => {
    const [autoUpdatesEnabled, setAutoUpdatesEnabled] = useState<boolean>(false)

    useEffect(() => {
        // Set auto updates enabled state flag when spreadsheet is loaded
        if (spreadsheet)
            setAutoUpdatesEnabled(spreadsheet.autoUpdatesEnabled())
    }, [spreadsheet])

    // Update new auto updates mode in state and in spreadsheet class
    const handleToggleAutoUpdates = () => {
        if (spreadsheet) {
            // const prevVal = spreadsheet?.autoUpdatesEnabled()
            // spreadsheet?.setAutoUpdates(!prevVal)
            // setAutoUpdatesEnabled(!prevVal)
        }
    }

    const ownershipStatus = user.getUserName() === spreadsheet?.getPublisher()
        ? "Publisher"
        : "Editor"

    return (
        <div className='top-row'>
            <div className='top-left-row'>
                <NavLink className='home-button buttons' to='/'>
                    Home
                </NavLink>
                {/* If current spreadsheet isn't owned by current user, update subscription 
                button will appear if the owner has disabled auto updates for editors so they can
                send update requests */}
                {ownershipStatus !== 'Publisher' ?
                    <button 
                        className='save-button buttons'
                        onClick={() => handleUpdateSubscription(spreadsheet)}
                        style={{ display: `${autoUpdatesEnabled ? 'none' : ''}` }}
                    >
                        Update Subscription
                    </button>
                    :
                    <button
                        className='save-button buttons'
                        onClick={handleToggleAutoUpdates}
                    >
                        {autoUpdatesEnabled ? 'Disable' : 'Enable'} Auto Updates
                    </button>
                }
                <h1>{spreadsheet?.getSheetName().substring(0, 30)}</h1>
            </div>
            <div className='top-right-row'>
                <p className="profile">{user.getUserName().substring(0, 20) + ': ' + ownershipStatus}</p>
                <NavLink 
                    className='logout-button buttons'
                    onClick={() => updateCurrentUser(null)}
                    to='/?'
                >
                    Logout
                </NavLink>
            </div>
        </div>
    )
}

export default TopRow