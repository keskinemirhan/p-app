import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { DataSource } from "typeorm";
import { AccountService } from "src/account/account.service";
import { MailerService, MailOptions } from "src/mailer/mailer.service";
import { EntityManager } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";

type InvalidValues = { [k: string]: any[] };
type validValues = { [k: string]: any };

export class TestHelper {
  private mails: MailOptions[] = [];
  private moduleRef: TestingModule;
  private moduleCreated: boolean = false;
  private appCreated: boolean = false;
  private app: INestApplication;
  private dataSource: DataSource;

  async createTestingModule(): Promise<TestingModule> {
    if (this.moduleCreated) throw new Error("A testing module already created");
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

  async createTestingApplication(): Promise<INestApplication> {
    if (this.appCreated) throw new Error("An app already created");
    if (!this.moduleCreated) await this.createTestingModule();
    this.app = this.moduleRef.createNestApplication();
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );
    return this.app;
  }

  async clearDatabase(): Promise<void> {
    if (!this.moduleCreated) throw Error("Testing module is not created");
    await this.dataSource.synchronize(true);
  }

  async createTestingAccount(
    email: string,
    password: string,
    moduleRef: TestingModule
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
    if (this.moduleCreated) await this.moduleRef.close();
    if (this.appCreated) await this.app.close();
  }

  invalidObjectCrossing(
    validValues: validValues,
    invalidValues: InvalidValues,
  ) {
    const objects = [];
    for (const ikey in invalidValues) {
      for (const ivalue of invalidValues[ikey]) {
        const obj = {};
        obj[ikey] = ivalue;
        for (const key in validValues) {
          if (key !== ikey) obj[key] = validValues[key];
        }
        objects.push(obj);
      }
    }
    return objects;
  }
}
