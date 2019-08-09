/* tslint:disable:no-console */
import * as admin from 'firebase-admin';
import * as uuidv4 from 'uuid/v4';

import { firebaseConfig, serviceAccount } from '../../../config';

export class FirestoreClient {
  public firestore: admin.firestore.Firestore;
  public storage: admin.storage.Storage;
  public connected: boolean = false;
  private app: admin.app.App;

  public async connect(
    connectionInterval: number = 5000,
  ): Promise<FirestoreClient> {
    while (!this.connected) {
      try {
        this.app = await admin.initializeApp(
          {
            credential: admin.credential.cert(serviceAccount),
            databaseURL: firebaseConfig.databaseURL,
          },
          `insectify-api-dev${uuidv4()}`,
        );
        this.firestore = this.app.firestore();
        this.storage = this.app.storage();
        this.connected = true;
      } catch (err) {
        console.log(`[Firestore Client] Error: ${err.message}`);
        console.log(
          `[Firestore Client] Retrying connection in ${connectionInterval} ms...`,
        );
        await new Promise((resolve: any, reject: any) => {
          try {
            setTimeout(() => {
              this.connect();
              resolve();
            }, connectionInterval);
          } catch (err) {
            reject();
          }
        });
      }
    }
    return this;
  }
}
