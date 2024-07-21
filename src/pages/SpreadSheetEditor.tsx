import { Component } from 'react';
import FunctionBar from '../components/spreadSheetComponents/ribbonComponents/functionBar';
import Table from '../components/spreadSheetComponents/tableComponents/Table';
import Spreadsheet from '../backend/Spreadsheet';
import TopRow from '../components/spreadSheetComponents/ribbonComponents/TopRow';
import User from '../backend/User';
import { ICell } from '../backend/ICell';
import './pagesCSS/spreadsheetEditor.css';
import { getColumnValues } from '../utils/generateSheetData';
import Controller from '../backend/controller/controller';
import getUpdatesForPublished from '../backend/controller/requests/getUpdatesForPublished';
import UpdateSubscription from '../backend/controller/requests/updateSubscription';
import UpdatePublished from '../backend/controller/requests/updatePublished';
import GetUpdatesForSubscription from '../backend/controller/requests/getUpdatesForSubscription';
// @author Robert Roach

interface SpreadSheetEditorState {
    errorMessage: string,
    loading: boolean,
    tableData: ICell[][],
    selectedCell: ICell | null,
}

interface SpreadSheetEditorProps {
    controller: Controller,
    spreadsheet: Spreadsheet | null,
    updateCurrentUser: (user: User | null) => void,
    user: User,
}

class SpreadSheetEditor extends Component<SpreadSheetEditorProps, SpreadSheetEditorState> {
    constructor(props: SpreadSheetEditorProps) {
        super(props)
        this.state = {
            errorMessage: '',
            loading: false,
            tableData: [],
            selectedCell: null,
        }
        this.handleCellChange = this.handleCellChange.bind(this)
        this.changeSelectedCell = this.changeSelectedCell.bind(this)
        this.handleUpdateSubscription = this.handleUpdateSubscription.bind(this)
        this.handleFunctionInput = this.handleFunctionInput.bind(this)
    }

    // Updates tableData to be the passed in spreadSheet's cells on component mount
    async componentDidMount() {
        const { spreadsheet, user } = this.props

        try {
            if (spreadsheet) {
                this.setState({ loading: true })

                // If user is publisher, get subscription and published updates
                if (user.getUserName() === spreadsheet.getPublisher()) {

                    await this.props.controller.excecuteRequest(new getUpdatesForPublished(spreadsheet.getPublisher(), spreadsheet.getSheetName(), 0, user.getUserName(), user.getPassword()))

                    await this.props.controller.excecuteRequest(new GetUpdatesForSubscription(spreadsheet.getPublisher(), spreadsheet.getSheetName(), 0, user.getUserName(), user.getPassword()))
                }
                else {
                    // Get only subscription updates if not publisher
                    await this.props.controller.excecuteRequest(new GetUpdatesForSubscription(spreadsheet.getPublisher(), spreadsheet.getSheetName(), 0, user.getUserName(), user.getPassword()))
                }
                // Get all cells and initialize them in state
                const tableData = spreadsheet.getAllCells()
                // Add letter column headings
                const newTableData = [getColumnValues(spreadsheet.getColumns()), ...tableData]
                this.setState({ 
                    errorMessage: spreadsheet.getErrorMessage(), 
                    tableData: newTableData, 
                    loading: false })
            } else {
                this.setState({ errorMessage: "", loading: true })
            }
        } catch (error) {
            const tableData = spreadsheet!.getAllCells()
            // Add letter column headings
            const newTableData = [getColumnValues(spreadsheet!.getColumns()), ...tableData]
            this.setState({ 
                tableData: newTableData, 
                loading: false, 
                errorMessage: (error instanceof Error) ? error.message : "Problem loading spreadsheet" 
            })
        }
    }

    /**
     * Updates the value and function for selected cell
     * If the current user is the owner of the spreadsheet, updates are immediately published.
     */
    async handleCellChange(cell: ICell | null, value: string) {
        const { controller, spreadsheet, user } = this.props

        if (cell && spreadsheet) {
            cell.setFormula(value)
            // Format update like: $A7 15, or $A7 =SUM($A5:$A6)
            const update = "$" + cell.getColumnAsLetter() + (cell.getRow() + 1) + ' ' + cell.getFormula() + '\n'
                // If current user is owner of spreadsheet, immediately set published updates
            if (spreadsheet.getPublisher() === user.getUserName()) {
                await controller.excecuteRequest(
                    new UpdatePublished(
                        spreadsheet.getPublisher(), spreadsheet.getSheetName(),
                        Number(spreadsheet.getID()), update, user.getUserName(), user.getPassword())
                )
            } else {
                await controller.excecuteRequest(
                    new UpdateSubscription(
                        spreadsheet.getPublisher(), spreadsheet.getSheetName(),
                        Number(spreadsheet.getID()), update, user.getUserName(), user.getPassword())
                )
            }
            // Update tableData to rerender the table's new values
            const newTableData = [...this.state.tableData]
            this.setState({ errorMessage: "", tableData: newTableData })
        }
    }

    // Updates the function for selected cell then handles the logic for functions
    async handleFunctionInput(cell: ICell | null, input: string) {
        const { controller, spreadsheet, user } = this.props

        if (cell && spreadsheet) {
            cell.setFormula(input)
            // Format update like: $A7 15, or $A7 =SUM($A5:$A6)
            const update = "$" + cell.getColumnAsLetter() + (cell.getRow() + 1) + ' ' + cell.getFormula() + '\n'
            // If current user is owner of spreadsheet, immediately set published updates
            if (spreadsheet.getPublisher() === user.getUserName()) {
                await controller.excecuteRequest(
                    new UpdatePublished(
                        spreadsheet.getPublisher(), spreadsheet.getSheetName(),
                        Number(spreadsheet.getID()), update, user.getUserName(), user.getPassword())
                )
            } else {
                await controller.excecuteRequest(
                    new UpdateSubscription(
                        spreadsheet.getPublisher(), spreadsheet.getSheetName(),
                        Number(spreadsheet.getID()), update, user.getUserName(), user.getPassword())
                )
            }
            const newTableData = [...this.state.tableData]
            this.setState({ errorMessage: "", tableData: newTableData })
        }
    }

    /**
     * Stores the current selected cell in state
     */
    changeSelectedCell(cell: ICell) {
        this.setState({ selectedCell: cell })
    }

    /**
     * Handles calling the updateSubscription endpoint and passing in 
     * current changes to a spreadsheet
     * @param spreadsheet 
     */
    async handleUpdateSubscription(spreadsheet: Spreadsheet | null) {
        const { user } = this.props

        if (spreadsheet && user) {
            try {
                let sheetUpdates = spreadsheet.getUpdates()
                // Loop over the dictionary and format each entry
                const formattedUpdates = Object.entries(sheetUpdates)
                    .map(([key, value]) => `${key} ${value}`)
                    .join('\n');

                await this.props.controller.excecuteRequest(new UpdateSubscription(
                    user.getUserName(), spreadsheet.getSheetName(), Number(spreadsheet.getID()), formattedUpdates, user.getUserName(), user.getPassword()
                ))
                this.setState({ errorMessage: "" })
            } catch (error) {
                this.setState({ errorMessage: (error instanceof Error) ? error.message : "Problem sending subscription update" })
            }
        }
    }

    render() {
        const { errorMessage, loading, selectedCell, tableData } = this.state

        return (
            <div className='spreadsheet-editor-page'>
                <TopRow
                    handleUpdateSubscription={this.handleUpdateSubscription}
                    spreadsheet={this.props.spreadsheet}
                    user={this.props.user}
                    updateCurrentUser={this.props.updateCurrentUser}
                />
                <FunctionBar
                    handleFunctionInput={this.handleFunctionInput}
                    selectedCell={selectedCell}
                    tableData={tableData}
                />
                {loading ? <div>Loading...</div>
                    :
                    <>
                        {errorMessage !== "" && <div className='error'>{errorMessage}</div>} 
                        <Table
                            changeSelectedCell={this.changeSelectedCell}
                            handleCellChange={this.handleCellChange}
                            tableData={tableData}
                        />
                    </>
                }
            </div>
        )
    }
}

export default SpreadSheetEditor
