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

  public async requestActivation(email: string): Promise<boolean> {
    const activationSecret: string = uuidv4();
    const activationData: HashSaltPair = await this.jwtService.generateHashAndSalt(
      `${email}${activationSecret}`,
    );
    const usersWithSameEmail: UserDocument[] = await this.userCollection
      .limit(1)
      .where('email', '==', email)
      .getAll();
    const user: UserDocument = usersWithSameEmail[0];
    if (!user || user.isWaitingForActivation || user.isActivated) {
      throw new Error(
        'Activation request for account with provided email cannot be executed.',
      );
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
    await this.userCollection.update(
      new UserDocument({
        ...user,
        isWaitingForActivation: true,
      }),
    );

    await this.notificationsService.sendActivationEmail(
      email,
      activationSecret,
    );
    return true;
  }

  public async activate(email: string, secret: string) {
    const usersWithSameEmail: UserDocument[] = await this.userCollection
      .limit(1)
      .where('email', '==', email)
      .getAll();
    const user: UserDocument = usersWithSameEmail[0];
    if (!user || user.isActivated || !user.isWaitingForActivation) {
      throw new Error('Account with provided email cannot be activated.');
    }
    const auth: AuthDocument = await this.authCollection.get(user.id);

    const isSecretValid: boolean = await this.jwtService.checkWord(
      `${email}${secret}`,
      auth.activationSalt,
      auth.activationHash,
    );
    if (!isSecretValid) {
      throw new Error('Provided activation token is invalid');
    }

    await this.authCollection.update(
      new AuthDocument({
        ...auth,
        id: user.id,
        activationHash: null,
        activationSalt: null,
      }),
    );
    await this.userCollection.update(
      new UserDocument({
        ...user,
        isActivated: true,
        isWaitingForActivation: false,
      }),
    );
    return true;
  }
}
