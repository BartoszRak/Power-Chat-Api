import { Injectable, Inject } from '@nestjs/common';

import { AuthCollection } from '../../modules/storage/entities/auth/auth.collection';
import { UserCollection } from '../../modules/storage/entities/users/user.collection';
import { JwtService, HashSaltPair } from '../../modules/jwt/jwt.service';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../../modules/storage/entities/users/user.document';
import { AuthDocument } from '../../modules/storage/entities/auth/auth.document';
import { ActivationService } from './activation.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AuthCollection') private readonly authCollection: AuthCollection,
    @Inject('UserCollection') private readonly userCollection: UserCollection,
    @Inject('JwtService') private readonly jwtService: JwtService,
    @Inject('ActivationService')
    private readonly activationService: ActivationService,
  ) {}

  public async register(payload: RegisterDto): Promise<string> {
    const usersWithSameEmail: UserDocument[] = await this.userCollection
      .limit(1)
      .where('email', '==', payload.email)
      .getAll();
    if (usersWithSameEmail.length !== 0) {
      throw new Error(`Account with email "${payload.email}" already exist.`);
    }
    const password: string = payload.password;
    delete payload.password;
    const userId: string = await this.userCollection.add(
      new UserDocument(payload),
    );
    const passwordData: HashSaltPair = await this.jwtService.generateHashAndSalt(
      password,
    );
    await this.authCollection.set(
      new AuthDocument({
        id: userId,
        passwordHash: passwordData.hash,
        passwordSalt: passwordData.salt,
      }),
    );
    await this.activationService.requestActivation(payload.email);
    return await this.jwtService.encodeToken(payload);
  }
}
