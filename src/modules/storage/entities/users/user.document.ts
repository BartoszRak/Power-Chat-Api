import { Document } from '../../document';
import uuidv4 from 'uuid/v4';

export class UserDocument extends Document {
  constructor(public nickname: string = `Unnamed${uuidv4()}`) {
    super();
  }
}
