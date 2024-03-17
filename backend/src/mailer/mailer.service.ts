import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transporter, createTransport } from "nodemailer";
import SMTPPool from "nodemailer/lib/smtp-pool";

type MailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailerService implements OnModuleInit {
  private transporter: Transporter<SMTPPool.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      pool: true,
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get<number>("SMTP_PORT"),
      secure: this.configService.get<boolean>("SMTP_TLS"),
      auth: {
        user: this.configService.get("SMTP_USERNAME"),
        pass: this.configService.get("SMTP_PASSWORD"),
      }
    })
  }

  async onModuleInit() {}

  async sendMail(mailOptions: MailOptions) {
    await this.transporter.sendMail({
      ...mailOptions
    })
  }

}
