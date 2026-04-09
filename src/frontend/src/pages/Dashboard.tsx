import { Component } from 'react'
import './pagesCSS/dashboard.css'
import User from '../backend/User'
import DashboardHeader from '../components/dashboardComponents/DashboardHeader'
import Spreadsheet from '../backend/Spreadsheet'
import CreateSpreadsheetModal from '../components/dashboardComponents/CreateSpreadsheetModal'
import Controller from '../backend/controller/controller'
import MySheetsList from '../components/dashboardComponents/MySheetsList'
import OtherSheetsList from '../components/dashboardComponents/OtherSheetsList'
// @author Robert Roach

interface DashboardProps {
    controller: Controller,
    handleChooseSpreadsheet: (sheet: Spreadsheet) => void,
    handleCreateSpreadsheet: (name: string) => void,
    handleDeleteSpreadsheet: (name: string) => void,
    loading: boolean,
    spreadSheetList: Spreadsheet[],
    updateCurrentUser: (user: User | null) => void,
    user: User,
}

interface DashboardState {
    showMySheetsPage: boolean,
    isPopupModalOpen: boolean,
    pRDropdownsOpen: boolean[],
}

class Dashboard extends Component<DashboardProps, DashboardState> {
    constructor(props: DashboardProps) {
        super(props)
        this.state = {
            showMySheetsPage: true,
            isPopupModalOpen: false,
            pRDropdownsOpen: [],
        }
        this.handleTogglePRPopup = this.handleTogglePRPopup.bind(this)
        this.handleTogglePopupModal = this.handleTogglePopupModal.bind(this)
        this.handleTogglePage = this.handleTogglePage.bind(this)
    }

    // Initializes pRDropdownsOpen in state to be the same length as
    // spreadSheetList and indicate every PR menu is closed with false values
    componentDidMount(): void {
        this.setState({ pRDropdownsOpen: new Array(this.props.spreadSheetList.length).fill(false) })
    }

    // Changes the state flag that chooses what spreadsheet list to display
    handleTogglePage(): void {
        this.setState(prevState => ({ ...prevState, showMySheetsPage: !prevState.showMySheetsPage}))
    }

    // Handles opening or closing popup via state boolean flag
    handleTogglePopupModal(): void {
        this.setState(prevState => ({
            ...prevState, 
            isPopupModalOpen: !prevState.isPopupModalOpen,
        }))
    }

    /**
     * Takes in a spreadsheet's index for which to open or close
     * that spreadsheet's PR menu rendered immediately below the listed
     * spreadsheet in the list. 
     * 
     * @param index : index number for which sheet should have 
     * their dropdown toggled open or closed
     */
    handleTogglePRPopup(index: number) {
        this.setState(prevState => ({
            ...prevState,
            pRDropdownsOpen: [
                ...prevState.pRDropdownsOpen.slice(0, index), // Copy elements before 
                !prevState.pRDropdownsOpen[index], // Toggle the value at the index
                ...prevState.pRDropdownsOpen.slice(index + 1) // Copy elements after 
            ]
        }))
    }

    render() {
        const { controller, handleChooseSpreadsheet, handleCreateSpreadsheet, handleDeleteSpreadsheet, loading, spreadSheetList, updateCurrentUser, user } = this.props
        const { isPopupModalOpen, pRDropdownsOpen, showMySheetsPage } = this.state

        const mySheetsList = spreadSheetList.filter(sheet => sheet.getPublisher() === user.getUserName())
        const otherSheetsList = spreadSheetList.filter(sheet => sheet.getPublisher() !== user.getUserName())

        return (
            <div className='dashboard-page'>
                <DashboardHeader updateCurrentUser={updateCurrentUser} user={user} />
                <div className='dashboard-body'>

                    <div className='top-buttons-row'>
                        <div className='page-tab-buttons'>
                            <button 
                                className={`page-button my-sheet-button ${showMySheetsPage ? 'selected' : ''}`}
                                onClick={this.handleTogglePage}
                                disabled={showMySheetsPage}
                            >
                                My sheets
                            </button>
                            <button 
                                className={`page-button ${!showMySheetsPage ? 'selected' : ''}`}
                                name='otherSheets'
                                onClick={this.handleTogglePage}
                                disabled={!showMySheetsPage}
                            >
                                Other sheets
                            </button>
                        </div>
                        <button className='create-sheet-button' onClick={() => this.handleTogglePopupModal()}>
                            Create Spreadsheet
                        </button>
                    </div>

                    {/* Conditionally render popup modal for entering new spreadsheet info */}
                    {isPopupModalOpen && <CreateSpreadsheetModal handleCreateSpreadsheet={handleCreateSpreadsheet} handleTogglePopupModal={this.handleTogglePopupModal}
                    spreadsheetList={mySheetsList} user={user}/>}

                    {showMySheetsPage ?
                        <MySheetsList
                            controller={controller}
                            handleChooseSpreadsheet={handleChooseSpreadsheet}
                            handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                            handleTogglePRPopup={this.handleTogglePRPopup}
                            loading={loading}
                            pRDropdownsOpen={pRDropdownsOpen}
                            spreadSheetList={mySheetsList}
                            user={user}
                        />
                        :
                        <OtherSheetsList
                            controller={controller}
                            handleChooseSpreadsheet={handleChooseSpreadsheet}
                            handleDeleteSpreadsheet={handleDeleteSpreadsheet}
                            handleTogglePRPopup={this.handleTogglePRPopup}
                            loading={loading}
                            pRDropdownsOpen={pRDropdownsOpen}
                            spreadSheetList={otherSheetsList}
                            user={user}
                        />
                    }
                </div>
            </div>
        )
    }
}
export default Dashboard