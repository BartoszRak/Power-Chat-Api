import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import { jwtSecret } from '../../config';

export type HashSaltPair = {
  salt: string;
  hash: string;
};

@Injectable()
export class JwtService {
  private readonly __iterations: number = 10;
  private readonly __expireTime: number = 1800;

  public async encodeToken(data: any): Promise<string> {
    return await jwt.sign({
      data,
    }, jwtSecret, {
      algorithm: 'HS256',
      expiresIn: this.__expireTime,
    })
  }

  public async generateHashAndSalt(
    word: string,
    saltLength: number = 32,
  ): Promise<HashSaltPair> {
    const salt: string = await bcrypt.genSalt(saltLength);
    return new Promise<{ hash: string; salt: string }>(
      (resolve: any, reject: any) => {
        bcrypt.hash(
          `${salt}${word}`,
          this.__iterations,
          (error: any, hash: string) => {
            if (error) {
              reject(error);
            }
            resolve({ hash, salt });
          },
        );
      },
    );
  }

  public async checkWord(
    word: string,
    salt: string,
    wordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(`${salt}${word}`, wordHash);
  }
}
