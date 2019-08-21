import * as uuidv4 from 'uuid/v4';

import { Document } from '../../document';
import { copyProperties } from '../../../../utils';


export class UserDocument extends Document {
  public nickname: string = `Unnamed${uuidv4()}`;
  public description?: string = 'Hello, I am new!';
  public email: string = null
  public thumbnailUrl?: string = null;
  public isActivated?: boolean = false
  public isResettingPassword?: boolean = false
  constructor(data: UserDocument) {
    super();
    copyProperties(data, this);
  }
}
