import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { DataSource } from "typeorm";
import { MailerService, MailOptions } from "src/mailer/mailer.service";
import { EntityManager } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Account } from "src/account/entities/account.entity";
import { AuthService } from "src/auth/auth.service";
import { AuthController } from "src/auth/auth.controller";
import { EmailVerification } from "src/auth/entities/email-verification.entity";

type InjectionFields = { [k: string]: any[] };
type TemplateObject = { [k: string]: any };

export class TestHelper {
  private mails: MailOptions[] = [];
  private moduleRef: TestingModule;
  private moduleCreated: boolean = false;
  private appRef: INestApplication;
  private dataSource: DataSource;
  private accounts: Partial<Account>[] = [];

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

  async createTestingApp(): Promise<INestApplication> {
    if (!this.moduleCreated) await this.createTestingModule();
    const app = this.moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    this.appRef = await app.init();
    return this.appRef;
  }

  async clearDatabase(): Promise<void> {
    if (!this.moduleCreated) throw Error("Testing module is not created");
    await this.dataSource.synchronize(true);
  }

  async createTestingAccount(
    email: string,
    password: string = "StrongPassword*1",
    emailVerified: boolean = false,
  ) {
    if (!this.moduleCreated) throw Error("Testing module is not created");
    const authController = this.moduleRef.get<AuthController>(AuthController);
    this.accounts.push({
      email,
      password,
    });
    const registered = await authController.register({
      email,
      password,
      name: "Name",
      surname: "surname",
      birthDate: "2002-02-02",
    });

    if (emailVerified) {
      const emailVerification = await this.getManager().findOne(
        EmailVerification,
        {
          where: { id: registered.verificationId },
        },
      );
      await authController.verifyRegisterEmail({
        verificationId: registered.verificationId,
        access_token: registered.access_token,
        code: emailVerification.code,
      });
    }
    return registered;
  }

  async loginTestingAccount(email: string) {
    const authService = this.moduleRef.get<AuthService>(AuthService);
    const password = this.accounts.find((a) => a.email === email).password;
    authService.login(email, password);
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
  }

  fieldInjectMultiplication(
    templateObj: TemplateObject,
    injectionFields: InjectionFields,
  ) {
    const objects = [];
    for (const ikey in injectionFields) {
      for (const ivalue of injectionFields[ikey]) {
        const obj = {};
        obj[ikey] = ivalue;
        for (const key in templateObj) {
          if (key !== ikey) obj[key] = templateObj[key];
        }
        objects.push(obj);
      }
    }
    return objects;
  }
}
