import User from "./User";
import Spreadsheet from "./Spreadsheet";

//Tests for User
//Ownership: Carly Bates

describe('User', () => {
    let user: User;
    let spreadsheet: Spreadsheet;

    beforeEach(() => { //Defines user and spreadsheet for tests to work with
        user = new User("john_doe", "password123");
        spreadsheet = new Spreadsheet("test publisher", "test name", 3, 4); // Creating a 3x4 spreadsheet for testing
    });

    test('should create a user with firstName, username, and password', () => {
        expect(user.getUserName()).toBe("john_doe"); //Checks if function returns the correct username
        expect(user.getPassword()).toBe("password123"); //Checks if function returns the correct password
    });

    test('should add a spreadsheet to owner sheets', () => {
        user.addToOwnerSheets(spreadsheet);
        const ownerSheets = user.getOwnerSheets();
        expect(ownerSheets).toContain(spreadsheet); //Checks if spreadsheet correctly saved to user's owned sheets 
    });

    test('should add a spreadsheet to editor sheets', () => {
        user.addToEditorSheets(spreadsheet);
        const editorSheets = user.getEditorSheets();
        expect(editorSheets).toContain(spreadsheet); //Checks if spreadsheet correctly saved to user's editor sheets
    });

    test('should initialize ownerSheets and editorSheets as empty arrays', () => {
        expect(user.getOwnerSheets()).toEqual([]); //Checks if OwnerSheets is empty upon initiation
        expect(user.getEditorSheets()).toEqual([]); //Checks if EditorSheets is empty upon initiation
    });
});
