import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  async sendMail(to: string, confirm_url: string) {
    return this.mailerService.sendMail({
      to,
      from: this.configService.get('MAIL_AUTH_USER'),
      subject: 'Welcome to App',
      template: './welcome',
      context: {
        confirm_url,
      },
    });
  }
}
