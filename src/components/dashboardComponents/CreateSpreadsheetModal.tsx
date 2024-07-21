import { FC, useState } from "react";
import PopupModal from "./PopupModal";
import './dashboardCSS/popups.css'
import Spreadsheet from "../../backend/Spreadsheet";
import User from "../../backend/User";
// @author Robert Roach

interface CreateSpreadsheetModalProps {
    handleTogglePopupModal: () => void,
    handleCreateSpreadsheet: (name: string, rows: number, columns: number) => void,
    spreadsheetList: Spreadsheet[],
    user: User,
}

const CreateSpreadsheetModal: FC<CreateSpreadsheetModalProps> = ({ handleTogglePopupModal, handleCreateSpreadsheet, spreadsheetList, user }) => {

    const [name, setName] = useState('')
    const [rows, setRows] = useState('')
    const [columns, setColumns] = useState('')
    const [error, setError] = useState('')

    // Handles logic for creating a spreadsheet in the popup
    const handleClickCreate = (name: string, rows: string, columns: string) => {
        const existingSpreadsheet = spreadsheetList.find(ss => 
            ss.getSheetName() === name && ss.getPublisher() === user.getUserName())

        // If name field is empty or if spreadsheet name already exists, display error
        if (name !== '') {
            if (existingSpreadsheet) {
                setError("Spreadsheet name already exists")
            } else {
                handleTogglePopupModal()
                handleCreateSpreadsheet(name, Number(rows), Number(columns))
            }
        } else {
            setError('Spreadsheet must have a name')
        }
    }

    // Creating a new spreadsheet content to be rendered inside popup modal
    const spreadsheetPopupContent: React.ReactNode = (
            <div className="create-spreadsheet-popup-content">
                <h2>New Spreadsheet</h2>
                <div className='field-and-input'>
                    <p>Name:</p>
                    <input 
                        className="name-input" 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name" />
                </div>
                <div className="row-input">
                    <div className='field-and-input'>
                        <p>Rows:</p>
                        <input 
                            className="dimension-input" 
                            onChange={(e) => setRows(e.target.value)}
                            placeholder="Rows" />
                    </div>
                    <div className='field-and-input'>
                        <p>Columns:</p>
                        <input 
                            className="dimension-input" 
                            onChange={(e) => setColumns(e.target.value)}
                            placeholder="Columns" />
                    </div>
                    {error !== '' 
                        ? <div className='error'>{error}</div> 
                        : <></>
                    }
                </div>
                <div className='buttons'>
                    <button onClick={() => handleTogglePopupModal()}>Cancel</button>
                    <button 
                        onClick={() => { handleClickCreate(name, rows, columns)}}
                    >
                        Create new spreadsheet
                    </button>
                </div>
            </div>
    )

    return (
        <PopupModal content={spreadsheetPopupContent} handleTogglePopupModal={handleTogglePopupModal}/>
    )
}

export default CreateSpreadsheetModal