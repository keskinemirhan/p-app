import { INestApplication } from "@nestjs/common";
import { compare } from "bcrypt";
import { Account } from "src/account/entities/account.entity";
import { AuthService } from "src/auth/auth.service";
import { ReqLoginDto } from "src/auth/dto/req-login.dto";
import { ReqRegisterDto } from "src/auth/dto/req-register.dto";
import { ReqVerifyRegisterEmailDto } from "src/auth/dto/req-verify-register-email.dto";
import { EmailVerification } from "src/auth/entities/email-verification.entity";
import { TokenService } from "src/auth/token.service";
import { Profile } from "src/profile/entities/profile.entity";
import * as request from "supertest";
import { TestHelper } from "test/test.helper";
import { EntityManager } from "typeorm";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let helper: TestHelper;
  let httpServer: any;
  let tokenService: TokenService;
  let manager: EntityManager;

  beforeAll(async () => {
    helper = new TestHelper();
    app = await helper.createTestingApp();
    httpServer = app.getHttpServer();
    tokenService = app.get<TokenService>(TokenService);
    manager = helper.getManager();
    await helper.clearDatabase();
  });
  afterAll(async () => {
    await app.close();
  });

  describe("/auth/register", () => {
    it("Does register", async () => {
      const registerBody: ReqRegisterDto = {
        email: "mail@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const response = await request(httpServer)
        .post("/auth/register")
        .send(registerBody);
      const body = response.body;
      expect(response.statusCode).toBe(201);
      expect(body).toBeDefined();
      expect(body.access_token).toBeDefined();
      expect(body.refresh_token).toBeDefined();
      expect(body.verificationId).toBeDefined();
      expect(
        tokenService.verifyAccessToken(body.access_token)
      ).resolves.not.toThrow();
      expect(
        tokenService.verifyRefreshToken(body.refresh_token)
      ).resolves.not.toThrow();
      const account = await manager.findOne(Account, {
        where: { email: "mail@mail.com" },
      });
      const emailVerification = await manager.findOne(EmailVerification, {
        where: { email: "mail@mail.com" },
      });
      expect(account).toBeDefined();
      expect(account.password).not.toEqual(registerBody.password);
      expect(account.email).toEqual(registerBody.email);
      expect(emailVerification).toBeDefined();
      expect(emailVerification.verified).toBeFalsy();
      const profile = await manager.findOne(Profile, {
        where: { account: { id: account.id } },
      });
      expect(profile.name).toBe(registerBody.name);
      expect(profile.surname).toBe(registerBody.surname);
      expect(new Date(profile.birthDate).toDateString()).toBe(
        new Date(registerBody.birthDate).toDateString()
      );
      expect(
        await compare(registerBody.password, account.password)
      ).toBeTruthy();
    });

    it("Handles already existing email", async () => {
      const registerBody: ReqRegisterDto = {
        email: "existing@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      await request(httpServer).post("/auth/register").send(registerBody);

      const emailVerificationExisting = await manager.findOne(
        EmailVerification,
        {
          where: { email: "existing@mail.com" },
        }
      );
      const registerBodyExisting: ReqRegisterDto = {
        email: "existing@mail.com",
        password: "NewStrongPassword*1",
        name: "newname",
        surname: "newsurname",
        birthDate: "2005-08-24",
      };
      const response = await request(httpServer)
        .post("/auth/register")
        .send(registerBodyExisting);
      expect(response.statusCode).toBe(400);

      const account = await manager.findOne(Account, {
        where: { email: "existing@mail.com" },
      });
      const emailVerificationNew = await manager.findOne(EmailVerification, {
        where: { email: "existing@mail.com" },
      });

      expect(account.email).toEqual(registerBody.email);
      if (emailVerificationExisting)
        expect(emailVerificationNew).toMatchObject(emailVerificationExisting);
      else expect(emailVerificationNew).toBeUndefined();

      const profile = await manager.findOne(Profile, {
        where: { account: { id: account.id } },
      });
      expect(profile.name).not.toBe(registerBodyExisting.name);
      expect(profile.surname).not.toBe(registerBodyExisting.surname);
      expect(new Date(profile.birthDate).toDateString()).not.toBe(
        new Date(registerBodyExisting.birthDate).toDateString()
      );
      expect(
        await compare(registerBodyExisting.password, account.password)
      ).toBeFalsy();
    });

    it("Does send verification email", async () => {
      const registerBody: ReqRegisterDto = {
        email: "verification@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const response = await request(httpServer)
        .post("/auth/register")
        .send(registerBody);
      const body = response.body;
      const emailVerification = await manager.findOne(EmailVerification, {
        where: { email: "verification@mail.com" },
      });

      expect(emailVerification).toBeDefined();
      expect(emailVerification.id).toBe(body.verificationId);
      const code = emailVerification.code;
      const mail = helper
        .getMails()
        .find((val) => val.to === "verification@mail.com");
      expect(mail).toBeDefined();
      expect(mail.html.includes(code));
    });

    it("Handles invalid request body", () => {
      const invalidValues = {
        name: ["Name-", "Name Surname", undefined],
        surname: ["Name-", "Name Surname", undefined],
        email: ["Name", "mail", undefined],
        password: ["password", "Weak  Weak", undefined],
        birthDate: ["2024.12.28", "2024/12/07", undefined],
      };
      const validValues = {
        name: "Name",
        surname: "Surname",
        email: "mail@mail.com",
        password: "PasswordStrong*1",
        birthDate: "2012-08-01",
      };

      const objects = helper.fieldInjectMultiplication(
        validValues,
        invalidValues
      );
      for (const obj of objects) {
        request(httpServer).post("/auth/register").send(obj).expect(400);
      }
    });
  });

  describe("/auth/register/verify-email", () => {
    beforeAll(async () => {
      await helper.clearDatabase();
    });

    it("Does verify email", async () => {
      const registerBody: ReqRegisterDto = {
        email: "mail@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const response = await request(httpServer)
        .post("/auth/register")
        .send(registerBody);
      const body = response.body;
      const emailVerification = await manager.findOne(EmailVerification, {
        where: { id: body.verificationId },
      });
      const reqVerify: ReqVerifyRegisterEmailDto = {
        verificationId: body.verificationId,
        access_token: body.access_token,
        code: emailVerification.code,
      };
      await request(httpServer)
        .post("/auth/register/verify-email")
        .send(reqVerify)
        .expect(200);
      const account = await manager.findOne(Account, {
        where: { email: "mail@mail.com" },
      });
      expect(account.isEmailVerified).toBeTruthy();
    });

    it("Handles invalid request body", async () => {
      const registerBodyFirst: ReqRegisterDto = {
        email: "mail1@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const responseFirst = await request(httpServer)
        .post("/auth/register")
        .send(registerBodyFirst);
      const bodyFirst = responseFirst.body;

      const registerBodySecond: ReqRegisterDto = {
        email: "mail2@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const responseSecond = await request(httpServer)
        .post("/auth/register")
        .send(registerBodySecond);
      const bodySecond = responseSecond.body;
      const emailVerificationFirst = await manager.findOne(EmailVerification, {
        where: { id: bodyFirst.verificationId },
      });
      const emailVerificationSecond = await manager.findOne(EmailVerification, {
        where: { id: bodySecond.verificationId },
      });
      let wrongCode = "111111";
      const authService = app.get<AuthService>(AuthService);
      while (wrongCode === emailVerificationFirst.code)
        wrongCode = authService.generateVerificationCode();

      const testInputs = helper.fieldInjectMultiplication(
        {
          verificationId: bodyFirst.verificationId,
          access_token: bodyFirst.access_token,
          code: emailVerificationFirst.code,
        },
        {
          verificationId: [bodySecond.verificationId, "notuuid", undefined],
          access_token: [bodySecond.access_token, "nottoken", undefined],
          code: [emailVerificationSecond.code, wrongCode],
        }
      );
      for (const input of testInputs) {
        request(httpServer)
          .post("/auth/register/verify-email")
          .send(input)
          .expect(400);
      }
      const accountFirst = await manager.findOne(Account, {
        where: { email: "mail1@mail.com" },
      });
      const accountSecond = await manager.findOne(Account, {
        where: { email: "mail1@mail.com" },
      });
      expect(accountFirst.isEmailVerified).toBeFalsy();
      expect(accountSecond.isEmailVerified).toBeFalsy();
    });

    it("Handles already verified account", async () => {
      const { access_token } = await helper.createTestingAccount(
        "verified@mail.com",
        "StrongPassword*1",
        true
      );

      await request(httpServer)
        .post("/auth/register")
        .send({ access_token })
        .expect(400);
    });
  });

  describe("/auth/register/create-verification", () => {
    beforeAll(async () => {
      await helper.clearDatabase();
    });
    it("Does create verification", async () => {
      const registerBody: ReqRegisterDto = {
        email: "mail@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const regRes = await request(httpServer)
        .post("/auth/register")
        .send(registerBody);
      const firstEmailVerification = await manager.findOne(EmailVerification, {
        where: { email: "mail@mail.com" },
      });
      helper.clearMails();
      const response = await request(httpServer)
        .post("/auth/register/create-verification")
        .send({ access_token: regRes.body.access_token })
        .expect(201);

      const body = response.body;
      expect(body).toBeDefined();
      expect(body.access_token).toBeDefined();
      expect(body.refresh_token).toBeDefined();
      expect(body.verificationId).toBeDefined();

      const lastEmailVerification = await manager.findOne(EmailVerification, {
        where: { email: "mail@mail.com" },
      });
      expect(lastEmailVerification).toBeDefined();
      expect(lastEmailVerification.id).not.toBe(firstEmailVerification.id);
      expect(lastEmailVerification.id).toEqual(body.verificationId);
      const email = helper.getMails().find((m) => m.to === "mail@mail.com");
      expect(email).toBeDefined();
      const reqVerify: ReqVerifyRegisterEmailDto = {
        verificationId: body.verificationId,
        access_token: body.access_token,
        code: lastEmailVerification.code,
      };
      request(httpServer)
        .post("/auth/register/create-verification")
        .send(reqVerify)
        .expect(200);
    });

    it("Handles invalid request body", async () => {
      const notToken = {
        access_token: "notatoken",
      };
      const empty = {};
      request(httpServer)
        .post("/auth/register/create-verification")
        .send(notToken)
        .expect(401);
      request(httpServer)
        .post("/auth/register/create-verification")
        .send(empty)
        .expect(401);
    });

    it("Handles invalid access token", async () => {
      const tokenService = app.get<TokenService>(TokenService);
      const invalidAccess = await tokenService.createAccessToken({});
      request(httpServer)
        .post("/auth/register/create-verification")
        .send({
          access_token: invalidAccess,
        })
        .expect(401);
    });

    it("Handles already verified accounts", async () => {
      const { access_token } = await helper.createTestingAccount(
        "verified@mail",
        "StrongPassword*1",
        true
      );

      await request(httpServer)
        .post("/auth/register/create-verification")
        .send({
          access_token,
        })
        .expect(400);
    });
  });

  describe("/auth/login", () => {
    beforeAll(async () => {
      await helper.clearDatabase();
      const registerBodyFirst: ReqRegisterDto = {
        email: "mail1@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const registerBodySecond: ReqRegisterDto = {
        email: "mail2@mail.com",
        password: "StrongPassword*2",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      await request(httpServer).post("/auth/register").send(registerBodyFirst);
      await request(httpServer).post("/auth/register").send(registerBodySecond);
    });

    it("Should login", async () => {
      const loginDtoFirst: ReqLoginDto = {
        email: "mail1@mail.com",
        password: "StrongPassword*1",
      };
      const loginDtoSecond: ReqLoginDto = {
        email: "mail2@mail.com",
        password: "StrongPassword*2",
      };

      const responseFirst = await request(httpServer)
        .post("/auth/login")
        .send(loginDtoFirst)
        .expect(200);
      const responseSecond = await request(httpServer)
        .post("/auth/login")
        .send(loginDtoSecond)
        .expect(200);

      const bodyFirst = responseFirst.body;
      const bodySecond = responseSecond.body;

      expect(bodyFirst).toBeDefined();
      expect(bodySecond).toBeDefined();
      expect(bodyFirst.access_token).toBeDefined();
      expect(bodySecond.access_token).toBeDefined();
      expect(bodyFirst.refresh_token).toBeDefined();
      expect(bodySecond.refresh_token).toBeDefined();
    });

    it("Should not login if invalid input given", () => {
      const wrongInputs = helper.fieldInjectMultiplication(
        {
          email: "mail1@mail.com",
          password: "StrongPassword*1",
        },
        {
          email: [
            "mail2@mail.com",
            "notamail",
            "nonexistent@mail.com",
            undefined,
          ],
          password: ["StrongPassword*2", "weak", undefined],
        }
      );
      for (const input of wrongInputs) {
        request(httpServer).post("/auth/login").send(input).expect(400);
      }
    });
  });

  describe("/auth/refresh", () => {
    beforeAll(async () => {
      await helper.clearDatabase();
    });
    it("Does create token pair", async () => {
      const { refresh_token } =
        await helper.createTestingAccount("test@mail.com");
      const response = await request(httpServer)
        .post("/auth/refresh")
        .send({
          refresh_token,
        })
        .expect(201);
      expect(response.body).toBeDefined();
      expect(response.body.access_token).toBeDefined();
      expect(response.body.refresh_token).toBeDefined();
    });

    it("Handles nonexitent account", async () => {
      const { refresh_token } =
        await helper.createTestingAccount("removed@mail.com");
      const account = await manager.findOne(Account, {
        where: { email: "removed@mail.com" },
      });
      manager.remove(account);
      await request(httpServer)
        .post("/auth/refresh")
        .send({
          refresh_token,
        })
        .expect(404);
    });
    it("Handles invalid token", async () => {
      const tokenService = app.get<TokenService>(TokenService);
      const anyRefreshToken = await tokenService.createRefreshToken({});
      const notToken = "iamnotatoken";
      request(httpServer)
        .post("/auth/refresh")
        .send({ refresh_token: notToken })
        .expect(400);
      request(httpServer)
        .post("/auth/refresh")
        .send({ refresh_token: anyRefreshToken })
        .expect(400);
    });
  });
});
