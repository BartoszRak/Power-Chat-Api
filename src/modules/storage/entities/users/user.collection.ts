import { Collection } from '../../collection';
import { UserDocument } from './user.document';
import { StorageService } from '../../storage.service';

export class UserCollection extends Collection<UserDocument> {
  constructor(db: StorageService) {
    super(db, 'users');
  }
}
