import * as sinon from 'sinon';
import * as admin from 'firebase-admin';

import { FirestoreClient } from './firestore-client';

describe('Firestore client', () => {
  let sandbox: sinon.sandbox;
  let adminInitializeMock: any;
  let adminFirestoreMock: any;
  let adminStorageMock: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('creates instance properly', () => {
      const fsClient: FirestoreClient = new FirestoreClient();

      expect(fsClient).not.toBe(undefined);
      expect(fsClient.connected).toBe(false);
      expect(fsClient.firestore).toBe(undefined);
      expect(fsClient.storage).toBe(undefined);
    });
  });

  describe('connect', () => {
    it('connects properly', async () => {
      adminFirestoreMock = () => 'mockedFirestore';
      adminStorageMock = () => 'mockedStorage';
      adminInitializeMock = async () => ({
        firestore: adminFirestoreMock,
        storage: adminStorageMock,
      });

      sandbox.stub(admin, 'initializeApp').callsFake(adminInitializeMock);

      const fsClient: FirestoreClient = new FirestoreClient();
      await fsClient.connect();

      expect(fsClient.connected).toBe(true);
      expect(fsClient.firestore).toBe('mockedFirestore');
      expect(fsClient.storage).toBe('mockedStorage');
    });
  });
});
