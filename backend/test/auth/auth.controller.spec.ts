import { INestApplication } from "@nestjs/common";
import { compare } from "bcrypt";
import { Account } from "src/account/entities/account.entity";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { ReqLoginDto } from "src/auth/dto/req-login.dto";
import { ReqRegisterDto } from "src/auth/dto/req-register.dto";
import { ReqVerifyRegisterEmailDto } from "src/auth/dto/req-verify-register-email.dto";
import { EmailVerification } from "src/auth/entities/email-verification.entity";
import { TokenService } from "src/auth/token.service";
import { Profile } from "src/profile/entities/profile.entity";
import { TestHelper } from "test/test.helper";
import { EntityManager } from "typeorm";

describe("AuthController", () => {
  let manager: EntityManager;
  let appRef: INestApplication;
  let testHelper: TestHelper;
  let authController: AuthController;
  let tokenService: TokenService;

  beforeAll(async () => {
    testHelper = new TestHelper();
    appRef = await testHelper.createTestingApplication();
    manager = testHelper.getManager();
    authController = appRef.get<AuthController>(AuthController);
    tokenService = appRef.get<TokenService>(TokenService);
  });
  afterAll(async () => {
    await testHelper.closeApp();
  });

  describe(".register", () => {
    beforeAll(async () => {
      await testHelper.clearDatabase();
      testHelper.clearMails();
    });

    it("Should register", async () => {
      const registerBody: ReqRegisterDto = {
        email: "mail@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const response = await authController.register(registerBody);
      expect(response).toBeDefined();
      expect(response.verificationId).toBeDefined();
      expect(response.access_token).toBeDefined();
      expect(response.refresh_token).toBeDefined();
      expect(
        tokenService.verifyAccessToken(response.access_token)
      ).resolves.not.toThrow();
      expect(
        tokenService.verifyRefreshToken(response.refresh_token)
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

    it("Should not register if email already exists", async () => {
      const registerBody: ReqRegisterDto = {
        email: "existing@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      await authController.register(registerBody);
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

      expect(authController.register(registerBodyExisting)).rejects.toThrow();
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

    it("Should send verification email", async () => {
      const registerBody: ReqRegisterDto = {
        email: "verification@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const response = await authController.register(registerBody);
      const emailVerification = await manager.findOne(EmailVerification, {
        where: { email: "verification@mail.com" },
      });

      expect(emailVerification).toBeDefined();
      expect(emailVerification.id).toBe(response.verificationId);
      const code = emailVerification.code;
      const mail = testHelper
        .getMails()
        .find((val) => val.to === "verification@mail.com");
      expect(mail).toBeDefined();
      expect(mail.html.includes(code));
    });
  });

  describe(".verifyRegisterEmail", () => {
    beforeAll(async () => {
      await testHelper.clearDatabase();
    });

    it("Should verify email", async () => {
      const registerBody: ReqRegisterDto = {
        email: "mail@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const response = await authController.register(registerBody);
      const emailVerification = await manager.findOne(EmailVerification, {
        where: { id: response.verificationId },
      });
      const reqVerify: ReqVerifyRegisterEmailDto = {
        verificationId: response.verificationId,
        access_token: response.access_token,
        code: emailVerification.code,
      };
      await expect(
        authController.verifyRegisterEmail(reqVerify)
      ).resolves.not.toThrow();
      const account = await manager.findOne(Account, {
        where: { email: "mail@mail.com" },
      });
      expect(account.isEmailVerified).toBeTruthy();
    });

    it("Should not verify email if invalid parameters are given", async () => {
      const registerBodyFirst: ReqRegisterDto = {
        email: "mail1@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const responseFirst = await authController.register(registerBodyFirst);

      const registerBodySecond: ReqRegisterDto = {
        email: "mail2@mail.com",
        password: "StrongPassword*1",
        name: "name",
        surname: "surname",
        birthDate: "2004-08-24",
      };
      const responseSecond = await authController.register(registerBodySecond);

      const emailVerificationFirst = await manager.findOne(EmailVerification, {
        where: { id: responseFirst.verificationId },
      });
      const emailVerificationSecond = await manager.findOne(EmailVerification, {
        where: { id: responseSecond.verificationId },
      });
      let wrongCode = "111111";
      const authService = appRef.get<AuthService>(AuthService);
      while (wrongCode === emailVerificationFirst.code)
        wrongCode = authService.generateVerificationCode();

      const testInputs = testHelper.invalidObjectCrossing(
        {
          verificationId: responseFirst.verificationId,
          access_token: responseFirst.access_token,
          code: emailVerificationFirst.code,
        },
        {
          verificationId: [responseSecond.verificationId],
          access_token: [responseSecond.access_token],
          code: [emailVerificationSecond.code, wrongCode],
        }
      );
      for (const input of testInputs) {
        expect(authController.verifyRegisterEmail(input)).rejects.toThrow();
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
  });

  describe(".login", () => {
    beforeAll(async () => {
      await testHelper.clearDatabase();
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
      await authController.register(registerBodyFirst);
      await authController.register(registerBodySecond);
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
      await expect(authController.login(loginDtoFirst)).resolves.not.toThrow();
      await expect(authController.login(loginDtoSecond)).resolves.not.toThrow();

      const responseFirst = await authController.login(loginDtoFirst);
      const responseSecond = await authController.login(loginDtoSecond);

      expect(responseFirst).toBeDefined();
      expect(responseSecond).toBeDefined();
      expect(responseFirst.access_token).toBeDefined();
      expect(responseSecond.access_token).toBeDefined();
      expect(responseFirst.refresh_token).toBeDefined();
      expect(responseSecond.refresh_token).toBeDefined();
    });

    it("Should not login if invalid input given", async () => {
      const wrongInputs = testHelper.invalidObjectCrossing(
        {
          email: "mail1@mail.com",
          password: "StrongPassword*1",
        },
        {
          email: ["mail2@mail.com", "nonexistent@mail.com"],
          password: ["StrongPassword*2"],
        }
      );
      for (const input of wrongInputs) {
        await expect(authController.login(input)).rejects.toThrow();
      }
    });
  });
});
