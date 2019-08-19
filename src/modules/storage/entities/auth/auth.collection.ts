import { Collection } from '../../collection';
import { AuthDocument } from './auth.document';
import { StorageService } from '../../storage.service';

export class AuthCollection extends Collection<AuthDocument> {
  constructor(db: StorageService) {
    super(db, 'auth');
  }
}
