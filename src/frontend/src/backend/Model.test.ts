import Model from "./Model";
import Spreadsheet from "./Spreadsheet";
import User from "./User";

//Tests for Model
//Ownership: Carly Bates

describe("Model", () => {
    let model: Model;
    let user: User;

    beforeEach(() => {
        model = new Model();
        user = new User("Publisher1", "pw123");
    });

    test("should initialize with empty spreadsheets and users", () => {
        expect(model.getSpreadsheets()).toEqual([]);
        expect(model["users"]).toEqual([]);
        expect(model["currentUsername"]).toEqual("");
        expect(model["currentPwd"]).toEqual("");
    });

    test("should add user to session", () => {
        model.addUserToSession(user);
        expect(model["users"]).toContain(user);
        expect(model["currentUsername"]).toEqual("Publisher1");
    });

    test("should initialize sheets", () => {
        const publisher = "test publisher";
        const sheetNames = ["Sheet1", "Sheet2", null, "Sheet4"];
        model.initializeSheets(publisher, sheetNames);
        const spreadsheets = model.getSpreadsheets();
        expect(spreadsheets.length).toBe(3); // Only non-null sheet names are added
        expect(spreadsheets[0].getSheetName()).toBe("Sheet1");
        expect(spreadsheets[1].getSheetName()).toBe("Sheet2");
        expect(spreadsheets[2].getSheetName()).toBe("Sheet4");
    });

    test("should create new sheet", () => {
        const publisher = "test publisher";
        const sheetName = "NewSheet";
        const rows = 5;
        const columns = 5;
        model.createSheet(publisher, sheetName, rows, columns);
        const spreadsheets = model.getSpreadsheets();
        expect(spreadsheets.length).toBe(1);
        expect(spreadsheets[0].getSheetName()).toBe(sheetName);
        expect(spreadsheets[0].getRows()).toBe(rows);
        expect(spreadsheets[0].getColumns()).toBe(columns);
    });

    test("should remove sheet", () => {
        const publisher = "test publisher";
        const sheetName = "SheetToRemove";
        const spreadsheet = new Spreadsheet(publisher, sheetName);
        model["spreadsheets"] = [spreadsheet];
        model.removeSheet(publisher, sheetName);
        expect(model.getSpreadsheets()).toEqual([]);
    });

    test("should add updates for published sheet", () => {
        const publisher = "test publisher";
        const sheetName = "PublishedSheet";
        const spreadsheet = new Spreadsheet(publisher, sheetName);
        const updates = "$A1 10\n$B2 20\n$C3 30";
        model["spreadsheets"] = [spreadsheet];
        model.addUpdatesForPublished(publisher, sheetName, updates);
        expect(spreadsheet.getCell(0, 0).getValue()).toBe("10");
        expect(spreadsheet.getCell(1, 1).getValue()).toBe("20");
        expect(spreadsheet.getCell(2, 2).getValue()).toBe("30");
    });

    test("should get subscription updates", () => {
        const publisher = "test publisher";
        const sheetName = "PublishedSheet";
        const spreadsheet = new Spreadsheet(publisher, sheetName);
        const updates = ["$A1 10\n$B2 20\n$C3 30"];
        model["spreadsheets"] = [spreadsheet];
        model.addAllUpdatesForSubscription(publisher, sheetName, updates);
        const subscriptionUpdates = model.getSubscriptionUpdates(publisher, sheetName);
        expect(subscriptionUpdates).toEqual([["$A1 10", "$B2 20", "$C3 30"]]);
    });

    test("should find sheet", () => {
        const publisher = "test_publisher";
        const sheetName = "TestSheet";
        const spreadsheet = new Spreadsheet(publisher, sheetName);
        model["spreadsheets"] = [spreadsheet];
        const foundSheet = model.findSheet(publisher, sheetName);
        expect(foundSheet).toBe(spreadsheet);
    });

    test("should add all updates for subscription", () => {
        const publisher = "test_publisher";
        const sheetName = "PublishedSheet";
        const spreadsheet = new Spreadsheet(publisher, sheetName);
        const updates = ["$A1 10\n$B2 20\n$C3 30"];
        model["spreadsheets"] = [spreadsheet];
        model.addAllUpdatesForSubscription(publisher, sheetName, updates);
        expect(spreadsheet.getSubscriptionUpdates()).toEqual([["$A1 10", "$B2 20", "$C3 30"]]);
    });

    test("should return current username", () => {
        const user = new User("john_doe", "password123");
        model.addUserToSession(user);
        expect(model.getCurrentUsername()).toEqual("john_doe");
    });

    test("should return current password", () => {
        // Assuming password is set elsewhere
        expect(model.getCurrentPwd()).toEqual("");
    });

    test("should return encoded credential", () => {
        // Assuming encoded credential is set elsewhere
        expect(model.getEncodedCred()).toEqual("");
    });
});