import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { keys } from '@footprint/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: keys.emailService.HOST,
        port: keys.emailService.PORT,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: keys.emailService.USER,
          pass: keys.emailService.PASSWORD,
        },
      },
      defaults: {
        from: `"${keys.APP_NAME}" <${keys.emailService.SENDER}>`,
      },
      template: {
        dir: join(__dirname, '..', '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      preview: !keys.IS_PRODUCTION,
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
