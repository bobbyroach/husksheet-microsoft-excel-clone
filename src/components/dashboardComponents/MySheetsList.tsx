import { FC } from "react"
import Spreadsheet from "../../backend/Spreadsheet"
import { NavLink } from "react-router-dom"
import Controller from "../../backend/controller/controller"
import User from "../../backend/User"
import PRMenuPopup from "./PRMenuPopup"
// @author Robert Roach

interface MySheetsListProps {
    controller: Controller,
    handleChooseSpreadsheet: (sheet: Spreadsheet) => void,
    handleDeleteSpreadsheet: (name: string) => void,
    handleTogglePRPopup: (index: number) => void,
    loading: boolean,
    pRDropdownsOpen: boolean[],
    spreadSheetList: Spreadsheet[],
    user: User,
}

const MySheetsList: FC<MySheetsListProps> = ({ controller, handleChooseSpreadsheet, handleDeleteSpreadsheet,  handleTogglePRPopup, loading, pRDropdownsOpen, spreadSheetList, user }) => {

    return (
        <div>
            {!loading ? <div className='spreadSheet-list'>
                <div className='spreadSheet-link spreadSheet-list-header my-sheets-header'>
                    <p>Name</p>
                </div>
                {spreadSheetList.map((sheet, index) =>
                    <div className='link-container' key={index}>
                        <NavLink
                            className='spreadSheet-link my-sheets-header'
                            onClick={() => handleChooseSpreadsheet(sheet)}
                            id={`${sheet.getPublisher()}-${sheet.getSheetName()}`}
                            to='/spreadsheet'
                        >
                            <p>{sheet.getSheetName()}</p>
                        </NavLink>
                        <button
                            className='pr-button'
                            onClick={() => { handleTogglePRPopup(index) }}
                        >
                            <p>View Update Requests</p>
                        </button>
                        <button
                            className='delete-button'
                            name='delete'
                            onClick={() => handleDeleteSpreadsheet(sheet.getSheetName())}
                        >
                            Delete
                        </button>

                        {/* Conditionally render PR popup menu for each spreadsheet */}
                        {pRDropdownsOpen[index] &&
                            <PRMenuPopup
                                controller={controller}
                                handleTogglePRPopup={handleTogglePRPopup}
                                PRIndex={index}
                                spreadSheetList={spreadSheetList}
                                user={user}
                            />}
                    </div>
                )}
            </div>
                :
                <div>Loading</div>}
        </div>
    )
}

export default MySheetsList