import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { StorageModule } from '../../modules/storage/storage.module'
import { AuthService } from './auth.service'
import { JwtModule } from '../../modules/jwt/jwt.module'
import { NotificationsModule } from '../../modules/notifications/notifications.module'
import { ActivationService } from './activation.service'

@Module({
  imports: [StorageModule, JwtModule, NotificationsModule],
  providers: [AuthService, ActivationService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}