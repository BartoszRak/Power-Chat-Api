import { Inject, Injectable } from '@nestjs/common';
import * as uuidv4 from 'uuid/v4';

import { NotificationsService } from '../../modules/notifications/notifications.service';
import { AuthCollection } from '../../modules/storage/entities/auth/auth.collection';
import { UserCollection } from '../../modules/storage/entities/users/user.collection';
import { JwtService, HashSaltPair } from '../../modules/jwt/jwt.service';
import { UserDocument } from '../../modules/storage/entities/users/user.document';
import { AuthDocument } from '../../modules/storage/entities/auth/auth.document';

@Injectable()
export class ActivationService {
  constructor(
    @Inject('AuthCollection') private readonly authCollection: AuthCollection,
    @Inject('UserCollection') private readonly userCollection: UserCollection,
    @Inject('JwtService') private readonly jwtService: JwtService,
    @Inject('NotificationsService')
    private readonly notificationsService: NotificationsService,
  ) {}

  public async requestActivation(email: string): Promise<void> {
    const activationSecret: string = uuidv4();
    const activationData: HashSaltPair = await this.jwtService.generateHashAndSalt(
      `${email}${activationSecret}`,
    );
    const usersWithSameEmail: UserDocument[] = await this.userCollection
      .limit(1)
      .where('email', '==', email)
      .getAll();
    const user: UserDocument = usersWithSameEmail[0];
    if (!user || user.isActivated) {
      throw new Error('Account with provided email cannot be activated.');
    }
    const auth: AuthDocument = await this.authCollection.get(user.id);
    await this.authCollection.update(
      new AuthDocument({
        ...auth,
        id: user.id,
        activationHash: activationData.hash,
        activationSalt: activationData.salt,
      }),
    );

    await this.notificationsService.sendActivationEmail(
      email,
      activationSecret,
    );
  }
}
