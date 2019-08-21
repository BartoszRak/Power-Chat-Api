import { MailerService } from './mailer.service';
import { nodemailerCredentials } from '../../config';

export const mailerProviders: any[] = [
  {
    provide: 'MainMailer',
    useFactory: (): MailerService => {
      const nodemailerEmail: string = nodemailerCredentials.email;
      const nodemailerPassword: string = nodemailerCredentials.password;
      const mailer: MailerService = new MailerService(
        {
          host: 'smtp.gmail.com',
          service: 'gmail',
          port: 587,
          secure: false,
          auth: {
            pass: nodemailerPassword,
            user: nodemailerEmail,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        'Power-Chat',
      );
      mailer.init();
      return mailer;
    },
  },
];
