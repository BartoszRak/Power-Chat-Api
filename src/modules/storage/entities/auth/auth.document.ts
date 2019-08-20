import { Document } from '../../document';
import { copyProperties } from '../../../../utils';

export class AuthDocument extends Document {
  public passwordSalt: string = null;
  public passwordHash: string = null;
  public activationSalt: string = null;
  public activationHash: string = null;
  public resetPasswordSalt: string = null;
  public resetPasswordHash: string = null;
  constructor(data: AuthDocument) {
    super();
    copyProperties(data, this);
  }
}
