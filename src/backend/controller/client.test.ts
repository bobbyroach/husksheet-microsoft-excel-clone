import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { 
  getPublishers, 
  getSheets, 
  createSheet, 
  deleteSheet, 
  getUpdatesForSubscription, 
  getUpdatesForPublished, 
  updatePublished, 
  updateSubscription, 
  checkLogin 
} from './client';

//Tests for Client
//Ownership: Carly Bates

const mock = new MockAdapter(axios);
const loginString = "Publisher1:pw123";
const encodedString = btoa(loginString);

describe('API Functions', () => {
  afterEach(() => {
    mock.reset(); // Reset the mock after each test
  });

  it('should check login credentials', async () => {
    const expectedResult = {
      success: true,
      message: 'Login successful',
      value: [],
    };
    mock.onGet('https://husksheets.fly.dev/api/v1/register').reply(200, expectedResult);

    const result = await checkLogin(encodedString);
    expect(result).toEqual(expectedResult);
  });

  it('should get publishers', async () => {
    const expectedResult = {
      success: true,
      message: 'Publishers retrieved successfully',
      value: [{ publisher: 'Publisher1' }, { publisher: 'Publisher2' }],
    };
    mock.onGet('https://husksheets.fly.dev/api/v1/getPublishers').reply(200, expectedResult);

    const result = await getPublishers(encodedString);
    expect(result).toEqual(expectedResult);
  });
//publisher tests
  it('should get sheets for a publisher', async () => {
    const publisher = 'Publisher1';
    const expectedResult = {
      success: true,
      message: 'Sheets retrieved successfully',
      value: [{ sheet: 'Sheet1' }, { sheet: 'Sheet2' }],
    };
    mock.onPost('https://husksheets.fly.dev/api/v1/getSheets').reply(200, expectedResult);

    const result = await getSheets(publisher, encodedString);
    expect(result).toEqual(expectedResult);
  });

  it('should create a sheet for a publisher', async () => {
    const publisher = 'Publisher1';
    const sheet = 'NewSheet';
    const expectedResult = {
      success: true,
      message: 'Sheet created successfully',
      value: [],
    };
    mock.onPost('https://husksheets.fly.dev/api/v1/createSheet').reply(200, expectedResult);

    const result = await createSheet(publisher, sheet, encodedString);
    expect(result).toEqual(expectedResult);
  });

  it('should delete a sheet for a publisher', async () => {
    const publisher = 'Publisher1';
    const sheet = 'Sheet1';
    const expectedResult = {
      success: true,
      message: 'Sheet deleted successfully',
      value: [],
    };
    mock.onDelete('https://husksheets.fly.dev/api/v1/deleteSheet').reply(200, expectedResult);

    const result = await deleteSheet(publisher, sheet, encodedString);
    expect(result).toEqual(expectedResult);
  });

  it('should get updates for a subscription', async () => {
    const publisher = 'Publisher1';
    const sheet = 'Sheet1';
    const id = 1;
    const expectedResult = {
      success: true,
      message: 'Updates retrieved successfully',
      value: [{ update: 'Update1' }, { update: 'Update2' }],
    };
    mock.onPost('https://husksheets.fly.dev/api/v1/getUpdatesForSubscription').reply(200, expectedResult);

    const result = await getUpdatesForSubscription(publisher, sheet, id, encodedString);
    expect(result).toEqual(expectedResult);
  });

  it('should get updates for published data', async () => {
    const publisher = 'Publisher1';
    const sheet = 'Sheet1';
    const id = 1;
    const expectedResult = {
      success: true,
      message: 'Updates retrieved successfully',
      value: [{ update: 'Update1' }, { update: 'Update2' }],
    };
    mock.onPost('https://husksheets.fly.dev/api/v1/getUpdatesForPublished').reply(200, expectedResult);

    const result = await getUpdatesForPublished(publisher, sheet, id, encodedString);
    expect(result).toEqual(expectedResult);
  });

  it('should update published data', async () => {
    const publisher = 'Publisher1';
    const sheet = 'Sheet1';
    const id = 1;
    const payload = 'NewPayload';
    const expectedResult = {
      success: true,
      message: 'Published data updated successfully',
      value: [],
    };
    mock.onPost('https://husksheets.fly.dev/api/v1/updatePublished').reply(200, expectedResult);

    const result = await updatePublished(publisher, sheet, id, payload, encodedString);
    expect(result).toEqual(expectedResult);
  });

  it('should update subscription data', async () => {
    const publisher = 'Publisher1';
    const sheet = 'Sheet1';
    const id = 1;
    const payload = 'NewPayload';
    const expectedResult = {
      success: true,
      message: 'Subscription data updated successfully',
      value: [],
    };
    mock.onPost('https://husksheets.fly.dev/api/v1/updateSubscription').reply(200, expectedResult);

    const result = await updateSubscription(publisher, sheet, id, payload, encodedString);
    expect(result).toEqual(expectedResult);
  });
});