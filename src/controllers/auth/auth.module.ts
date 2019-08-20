import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { StorageModule } from '../../modules/storage/storage.module'
import { AuthService } from './auth.service'
import { JwtModule } from '../../modules/jwt/jwt.module'

@Module({
  imports: [StorageModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}