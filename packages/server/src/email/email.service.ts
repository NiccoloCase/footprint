import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ProcessResult } from '../graphql';
import config from '@footprint/config';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   *  Invia per email il token per attivare un account
   */
  async sendConfirmationEmail(
    to: string,
    token: string,
    username: string,
  ): Promise<ProcessResult> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `${config.APP_NAME} - Attiva il tuo account`,
        text: `Dobbiamo solo verificare il tuo indirizzo email per attivare il tuo account. Riporta il codice sottostante nell'applicazione per procedere: ${token}`,
        template: 'confirmationEmail',
        context: { token, username },
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }

  /**
   *  Invia per email il token per cambiare pasword
   */
  async sendForgotPasswordEmail(
    to: string,
    token: string,
    username: string,
  ): Promise<ProcessResult> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `${config.APP_NAME} - Password dimenticata`,
        text: `Ciao ${username}! Ci risulta che stai cercando di cambiare la password del tuo account. Ti basterà riportare questo codice nell'applicazione nell'applicazione: ${token}`,
        template: 'forgotPasswordEmail',
        context: { token, username },
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }
}
