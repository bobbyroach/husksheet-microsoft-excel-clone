import { FC, useEffect, useState } from "react"
import PopupModal from "./PopupModal"
import Spreadsheet from "../../backend/Spreadsheet"
import './dashboardCSS/popups.css'
import Controller from "../../backend/controller/controller"
import GetUpdatesForSubscription from "../../backend/controller/requests/getUpdatesForSubscription"
import User from "../../backend/User"
import UpdatePublished from "../../backend/controller/requests/updatePublished"
// @author Robert Roach

interface PRMenuPopupProps {
    controller: Controller,
    handleTogglePRPopup: (index: number) => void,
    PRIndex: number,
    spreadSheetList: Spreadsheet[],
    user: User,
}

// Some parts of this component are not fully functional as they are bonus features
const PRMenuPopup: FC<PRMenuPopupProps> = ({ controller, handleTogglePRPopup, PRIndex, spreadSheetList, user }) => {
    const [updateRequests, setUpdateRequests] = useState<string[][]>([])
    const [error, setError] = useState("")

    // Retrieve the list of subscription updates when this component is rendered
    useEffect(() => {
        /**
         * Calls getSubscriptionUpdates endpoint and then returns the new updates from the
         * model, or throws an error
         */
        const getUpdates = async () => {
            try {
                const sheet = spreadSheetList[PRIndex]
                // Call getSubscriptionUpdates endpoint to retrive updates for the model

                // ------------> Bonus feature not fully implemented <----------------------

                await controller.excecuteRequest(
                    new GetUpdatesForSubscription(
                        user.getUserName(), sheet.getSheetName(), Number(sheet.getID()), user.getUserName(), user.getPassword())
                )

                // Get updates from the model
                // const updateList = controller.getModel()
                //     .getSubscriptionUpdates(user.getUserName(), sheet.getSheetName())
                const fakeUpdate = [["$A1 = fake update - feature not implemented"]]
                setUpdateRequests(fakeUpdate)
            } catch (error) {
                setError("Error getting subscription updates")
            }
        }
        getUpdates()
    }, [spreadSheetList, PRIndex, controller, user])

    /**
     * Approve a specific subscription update request and set a published update
     * @param updateRequestIndex : index of subscription change stored in spreadsheet to approve
     */
    const handleApproveSubscription = async (sheet: Spreadsheet, updateRequestIndex: number) => {
        try {
            const updates = sheet.getSubscriptionUpdates()[updateRequestIndex].join("\n")
            await controller.excecuteRequest(
                new UpdatePublished(
                    user.getUserName(), sheet.getSheetName(), Number(sheet.getID()), updates, user.getUserName(), user.getPassword())
            )
        } catch (error) {
            setError("Error setting published update")
        }
    }

    // Content to display PR Changes for a spreadsheet in a popup modal
    const PRMenuContent: React.ReactNode = (
        <div className='update-requests-body'>
            <h2>Pull Requests</h2>
            {error !== "" ? <div style={{ color: 'red' }}>{error}</div>
                : <>
                    {updateRequests.length === 0 ?
                        <div>No update requests</div>
                        :
                        <div className='update-requests-list'>
                            {updateRequests.map((updateRequest, requestIndex) => (

                                <div className='update-request' key={requestIndex}>
                                    <button
                                        className='approve-button'
                                        onClick={() => handleApproveSubscription(spreadSheetList[PRIndex], requestIndex)}
                                    >
                                        Approve Updates
                                    </button>
                                    <div className='updates-list'>
                                        {updateRequest.map((update, updateIndex) => (
                                            <div className='update' key={updateIndex}>
                                                {update}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </>}
        </div>
    )

    return (
        <PopupModal content={PRMenuContent} handleTogglePopupModal={() => handleTogglePRPopup(PRIndex)} />
    )
}

export default PRMenuPopup
