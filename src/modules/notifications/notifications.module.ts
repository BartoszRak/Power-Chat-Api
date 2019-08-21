import { Module } from '@nestjs/common';

import { MailerModule } from '../mailer/mailer.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [MailerModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
