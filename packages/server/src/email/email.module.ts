import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from '@footprint/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.emailService.HOST,
        port: config.emailService.PORT,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: config.emailService.USER,
          pass: config.emailService.PASSWORD,
        },
      },
      defaults: {
        from: `"${config.APP_NAME}" <${config.emailService.SENDER}>`,
      },
      template: {
        dir: join(__dirname, '..', '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      preview: !config.IS_PRODUCTION,
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
