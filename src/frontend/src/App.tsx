import { Component, Suspense, lazy } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import User from './backend/User'
import Spreadsheet from './backend/Spreadsheet'
import Controller from './backend/controller/controller'
import createSheet from './backend/controller/requests/createSheet'
import getSheets from './backend/controller/requests/getSheets'
import deleteSheet from './backend/controller/requests/deleteSheet'
import GetPublishers from './backend/controller/requests/getPublishers'
// @author Robert Roach

const SpreadSheetEditor = lazy(() => import('./pages/SpreadSheetEditor'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))

interface AppState {
  currentSpreadSheetInfo: {
    name: string,
    publisher: string,
  },
  controller: Controller,
  loading: boolean,
  user: User | null,
}

interface AppProps { }

class App extends Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props)
    this.state = {
      currentSpreadSheetInfo: {
        name: "",
        publisher: "",
      },
      controller: new Controller(),
      loading: false,
      user: null,
    }
    this.updateCurrentUser = this.updateCurrentUser.bind(this)
    this.handleChooseSpreadsheet = this.handleChooseSpreadsheet.bind(this)
    this.handleCreateSpreadsheet = this.handleCreateSpreadsheet.bind(this)
    this.handleDeleteSpreadsheet = this.handleDeleteSpreadsheet.bind(this)
  }

  /**
   * When user clicks on a spreadSheet in the list on the home page
   * this handles saving the currently selected spreadSheet's ID in state
   * @param sheetName : name of a spreadSheet - unique value
   */
  handleChooseSpreadsheet(sheet: Spreadsheet) {
    this.setState({ currentSpreadSheetInfo: {
      name: sheet.getSheetName(),
      publisher: sheet.getPublisher(),
    }})
  }

  // Adds a new spreadsheet to the database. Rows and columns set to 100 if 0
  async handleCreateSpreadsheet(name: string, rows: number = 100, columns: number = 100) {
      await this.state.controller.excecuteRequest(new createSheet(this.state.user!.getUserName(), name, this.state.user!.getUserName(), this.state.user!.getPassword()))
      // Force rerender to get changes to show immediately
      this.forceUpdate()
  }

  /**
   * Setting user on login or setting user to null to logout
   * and then retrieves all spreadsheets
   * @param user 
   */
  async updateCurrentUser(user: User | null) {
    this.setState({ user: user, loading: true })
    if (user) {
      await this.state.controller.excecuteRequest(new GetPublishers(user.getUserName(), user.getPassword()))
      const userList = this.state.controller.getModel().getPublishers()

      // Get sheets for every publisher
      const promises = userList.map(user2 =>
        this.state.controller.excecuteRequest(new getSheets(user2.getUserName(), user.getUserName(), user.getPassword()))
      )
      // Wait for all promises to complete
      await Promise.all(promises);
    }
    this.setState({ loading: false });
  }

  /**
   * Deletes the specified spreadsheet
   * @param sheetName 
   */
  async handleDeleteSpreadsheet(sheetName: string) {    
    await this.state.controller.excecuteRequest(new deleteSheet(this.state.user!.getUserName(), sheetName, this.state.user!.getUserName(), this.state.user!.getPassword()))

    // Force rerender to get changes to show immediately
    this.forceUpdate()
  }

  render() {
    const { currentSpreadSheetInfo, controller } = this.state
    const spreadSheetList = controller.getModel().getSpreadsheets()

    // Find the current selected spreadSheet by using current spreadSheet ID
    const currentSpreadSheet: Spreadsheet = spreadSheetList.find(ss => ss.getSheetName() === currentSpreadSheetInfo.name && ss.getPublisher() === currentSpreadSheetInfo.publisher) as Spreadsheet

    return (
      <div className="app">
        {/* Render login/signup page if user is null */}
        {!this.state.user ?
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path='/?'
                element={<Login
                  updateCurrentUser={this.updateCurrentUser}
                  user={this.state.user}
                />}
              />
            </Routes>
          </ Suspense>
          :
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path='/'
                element={
                  <Dashboard
                    controller={controller}
                    handleChooseSpreadsheet={this.handleChooseSpreadsheet}
                    handleCreateSpreadsheet={this.handleCreateSpreadsheet}
                    handleDeleteSpreadsheet={this.handleDeleteSpreadsheet}
                    loading={this.state.loading}
                    spreadSheetList={spreadSheetList}
                    updateCurrentUser={this.updateCurrentUser}
                    user={this.state.user}
                  />
                }
              />
              <Route
                path='/spreadsheet'
                element={
                  <SpreadSheetEditor
                    controller={controller}
                    spreadsheet={currentSpreadSheet}
                    updateCurrentUser={this.updateCurrentUser}
                    user={this.state.user}
                  />
                }
              />
            </Routes>
          </ Suspense>
        }
      </div>
    )
  }
}

export default App
