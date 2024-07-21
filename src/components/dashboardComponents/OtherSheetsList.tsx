import { FC } from "react"
import Spreadsheet from "../../backend/Spreadsheet"
import { NavLink } from "react-router-dom"
import Controller from "../../backend/controller/controller"
import User from "../../backend/User"
// @author Robert Roach

interface OtherSheetsListProps {
    controller: Controller,
    handleChooseSpreadsheet: (sheet: Spreadsheet) => void,
    handleDeleteSpreadsheet: (name: string) => void,
    handleTogglePRPopup: (index: number) => void,
    loading: boolean,
    pRDropdownsOpen: boolean[],
    spreadSheetList: Spreadsheet[],
    user: User,
}

const OtherSheetsList: FC<OtherSheetsListProps> = ({ handleChooseSpreadsheet, loading,  spreadSheetList }) => {

    // Sort the spreadSheetList first by publisher and then by sheet name
    const sortedSpreadSheetList = spreadSheetList.sort((a, b) => {
        const publisherA = a.getPublisher().toLowerCase();
        const publisherB = b.getPublisher().toLowerCase();
        const sheetNameA = a.getSheetName().toLowerCase();
        const sheetNameB = b.getSheetName().toLowerCase();

        if (publisherA < publisherB) return -1;
        if (publisherA > publisherB) return 1;
        if (sheetNameA < sheetNameB) return -1;
        if (sheetNameA > sheetNameB) return 1;
        return 0;
    })

    return (
        <div>
            {!loading ? <div className='spreadSheet-list'>
                <div className='spreadSheet-link spreadSheet-list-header'>
                    <p>Name</p>
                    <p className='publisher'>Publisher</p>
                </div>
                {sortedSpreadSheetList.map((sheet, index) =>
                    <div className='link-container' key={index}>
                        <NavLink
                            className='spreadSheet-link'
                            onClick={() => handleChooseSpreadsheet(sheet)}
                            id={`${sheet.getPublisher()}-${sheet.getSheetName()}`}
                            to='/spreadsheet'
                        >
                            <p>{sheet.getSheetName()}</p>
                            <p className='publisher'>{sheet.getPublisher()}</p>
                        </NavLink>
                    </div>
                )}
            </div>
                :
                <div>Loading</div>}
        </div>
    )
}
export default OtherSheetsList