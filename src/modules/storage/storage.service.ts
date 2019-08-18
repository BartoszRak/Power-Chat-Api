import * as admin from 'firebase-admin';

import { FirestoreClient } from './clients/firestore.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly firestoreClient: FirestoreClient = new FirestoreClient();
  private firestore: admin.firestore.Firestore;
  private storage: admin.storage.Storage;

  public async init(): Promise<void> {
    await this.firestoreClient.connect();

    this.firestore = this.firestoreClient.firestore;
    this.storage = this.firestoreClient.storage;
  }

  get fs(): any {
    return this.firestore;
  }

  get st(): any {
    return this.storage;
  }

  get timestamp(): any {
    return admin.firestore.FieldValue.serverTimestamp();
  }
}
