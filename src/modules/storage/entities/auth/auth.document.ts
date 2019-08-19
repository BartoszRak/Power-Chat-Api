import { Document } from '../../document';

export class AuthDocument extends Document {
  constructor(
    public passwordSalt: string,
    public passwordHash: string,
    public activationSalt: string,
    public activationHash: string,
    public resetPasswordSalt: string,
    public resetPasswordHash: string,
  ) {
    super();
  }
}
