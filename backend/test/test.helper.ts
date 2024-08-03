import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { DataSource } from "typeorm";
import { AccountService } from "src/account/account.service";
import { MailerService, MailOptions } from "src/mailer/mailer.service";
import { EntityManager } from "typeorm";

export class TestHelper {
  private mails: MailOptions[] = [];
  private moduleRef: TestingModule;
  private moduleCreated: boolean = false;
  private dataSource: DataSource;

  async createTestApplication(): Promise<TestingModule> {
    process.env["DB_NAME"] = "testing";
    process.env["DB_TYPE"] = "postgres";
    process.env["DB_SYNCHRONIZE"] = "true";
    process.env["DB_USERNAME"] = "testing";
    process.env["DB_PASSWORD"] = "testing";
    this.moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailerService)
      .useValue({
        sendMail: (mailOptions: MailOptions) => this.mails.push(mailOptions),
      })
      .compile();
    this.dataSource = this.moduleRef.get<DataSource>(DataSource);
    this.moduleCreated = true;
    return this.moduleRef;
  }

  async clearDatabase(): Promise<void> {
    if (!this.moduleCreated) throw Error("Testing module is not created");
    await this.dataSource.synchronize(true);
  }

  async createTestingAccount(
    email: string,
    password: string,
    moduleRef: TestingModule,
  ) {
    if (!this.moduleCreated) throw Error("Testing module is not created");
    const accountService = moduleRef.get<AccountService>(AccountService);
    return await accountService.create({ email, password });
  }

  getMails(): MailOptions[] {
    if (!this.moduleCreated) throw Error("Testing module is not created");
    return this.mails;
  }

  clearMails(): void {
    if (!this.moduleCreated) throw Error("Testing module is not created");
    this.mails = [];
  }

  getManager(): EntityManager {
    if (!this.moduleCreated) throw Error("Testing module is not created");
    return this.dataSource.createEntityManager();
  }
  async closeApp(): Promise<void> {
    await this.moduleRef.close();
  }
}