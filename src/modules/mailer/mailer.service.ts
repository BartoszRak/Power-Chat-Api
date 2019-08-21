import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { MailerConfiguration } from './interfaces/mailer-configuration.interface';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly __configuration: MailerConfiguration,
    private readonly __owner: string,
  ) {}

  public init = () => {
    this.transporter = nodemailer.createTransport({
      ...this.__configuration,
    });
  };

  async send(options: nodemailer.SendMailOptions): Promise<string> {
    if (!this.transporter) {
      throw new Error('Error with transport occured.');
    }
    const validOptions: nodemailer.SendMailOptions = {
      date: new Date().toISOString(),
      from: this.__owner,
      headers: {
        'Content-type': 'text/html; charset=UTF-8',
        ...options.headers,
      },
      ...options,
    };
    try {
      const info: string = await this.transporter.sendMail(validOptions);
      return info;
    } catch (err) {
      throw new Error(err);
    }
  }
}
