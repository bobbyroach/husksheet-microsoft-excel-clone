// dao.test.ts
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as dao from './dao';
import Spreadsheet from './models/spreadsheet';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean up the database before each test
  await Spreadsheet.deleteMany({});
});

const mockData = {
  sheetName: 'Test Sheet',
  publisherName: 'Test Publisher',
  editorNames: [],
  passkey: '123',
  updates: [
    {
      updateId: 1,
      updateDate: new Date(),
      updateEditor: 'Editor1',
      updateContent: 'Initial update',
    },
  ],
  subscriptionUpdates: [
    {
      updateId: 2,
      updateDate: new Date(),
      updateEditor: 'Editor2',
      updateContent: 'Initial subscription update',
    },
  ],
};

describe('DAO Tests', () => {
  beforeEach(async () => {
    // Insert mock data before each test
    await Spreadsheet.create(mockData);
  });

  test('should create and fetch all records', async () => {
    const sheets = await dao.getAll();
    expect(sheets).toHaveLength(1);
    expect(sheets[0].sheetName).toBe('Test Sheet');
  });

  test('should get publishers', async () => {
    const publishers = await dao.getPublishers();
    expect(publishers).toHaveLength(1);
    expect(publishers[0].publisherName).toBe('Test Publisher');
  });

  test('should get sheets by publisher', async () => {
    const sheets = await dao.getSheets(mockData.publisherName);
    expect(sheets).toHaveLength(1);
    expect(sheets[0].sheetName).toBe('Test Sheet');
  });

  test('should delete a sheet', async () => {
    await dao.deleteSheet(mockData.publisherName, mockData.sheetName);
    const sheets = await dao.getAll();
    expect(sheets).toHaveLength(0);
  });

  test('should get updates for subscriptions', async () => {
    const updates = await dao.getUpdatesForSubscriptions(mockData.publisherName, mockData.sheetName);
    expect(updates).toHaveLength(1);
    expect(updates[0].updateContent).toBe('Initial subscription update');
  });

  test('should get updates for published sheets', async () => {
    const updates = await dao.getUpdatesForPublished(mockData.publisherName, mockData.sheetName);
    expect(updates).toHaveLength(1);
    expect(updates[0].updateContent).toBe('Initial update');
  });

  test('should update published sheets', async () => {
    const newUpdate = { updateContent: 'New update content' };
    const result = await dao.updatePublished(mockData.publisherName, mockData.sheetName, newUpdate);
    const updates = await dao.getUpdatesForPublished(mockData.publisherName, mockData.sheetName);
    expect(updates).toHaveLength(2);
    expect(updates[1].updateContent).toBe('New update content');
  });

  test('should update subscription sheets', async () => {
    const newUpdate = { updateContent: 'New subscription update content' };
    const result = await dao.updateSubscription(mockData.publisherName, mockData.sheetName, newUpdate);
    const updates = await dao.getUpdatesForSubscriptions(mockData.publisherName, mockData.sheetName);
    expect(updates).toHaveLength(2);
    expect(updates[1].updateContent).toBe('New subscription update content');
  });
});