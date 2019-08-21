import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class NotificationsService {
  constructor(@Inject('MainMailer') private mailer: MailerService) {}

  public async sendRegistrationEmail(email: string): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        html: `
        <h1>Power-Chat</h1>
        <h2>Your account has been created!</h2>
        `,
        priority: 'normal',
        subject: 'Power-Chat - Your account has been created!',
        to: email,
      };

      await this.mailer.send(mailOptions);
    } catch (err) {
      throw new Error(err);
    }
  }

  public async sendActivationEmail(
    email: string,
    activationToken: string,
  ): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        html: `
        <h1>Power-Chat</h1>
        <h2>Activation for you account has been requested</h2>
        <br />
        <h3>Activaiton link:
        <a href="https://google.com?accountToActivate=${email}&activationToken=${activationToken}">Click to activate your account</a></h3>
        <p>* Link expiration time is 30 min</p>
        `,
        priority: 'normal',
        subject: 'Power-Chat - Account activation',
        to: email,
      };

      await this.mailer.send(mailOptions);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
