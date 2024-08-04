import { TestingModule } from "@nestjs/testing";
import { AuthService, VerificationType } from "src/auth/auth.service";
import { TokenService } from "src/auth/token.service";
import { TestHelper } from "test/test.helper";
import { AccountService } from "src/account/account.service";
import { MailerService, MailOptions } from "src/mailer/mailer.service";
import { EntityManager } from "typeorm";
import { EmailVerification } from "src/auth/entities/email-verification.entity";

describe("AuthService", () => {
  let authService: AuthService;
  let tokenService: TokenService;
  let accountService: AccountService;
  let mailerService: MailerService;
  let moduleRef: TestingModule;
  let testHelper: TestHelper;

  beforeAll(async () => {
    testHelper = new TestHelper();
    moduleRef = await testHelper.createTestingModule();
    authService = moduleRef.get<AuthService>(AuthService);
    tokenService = moduleRef.get<TokenService>(TokenService);
    accountService = moduleRef.get<AccountService>(AccountService);
    mailerService = moduleRef.get<MailerService>(MailerService);
  });

  afterAll(async () => {
    await testHelper.clearDatabase();
    await testHelper.closeApp();
  });

  it("Should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe(".createSessionTokenPair", () => {
    it("Should create token pair", async () => {
      const tokenPair = await authService.createSessionTokenPair("id");

      expect(tokenPair).toBeDefined();

      expect(tokenPair.access_token).toBeDefined();
      expect(tokenPair.refresh_token).toBeDefined();

      expect(
        tokenService.verifyRefreshToken(tokenPair.refresh_token)
      ).resolves.not.toThrow();
      expect(
        tokenService.verifyAccessToken(tokenPair.access_token)
      ).resolves.not.toThrow();
    });
  });

  describe(".login", () => {
    let email: string;
    let password: string;
    beforeAll(async () => {
      await testHelper.clearDatabase();
      email = "mail@mail.com";
      password = "password";
      await accountService.create({ email, password });
    });

    it("Should create valid token pair if credentials are valid", async () => {
      await expect(authService.login(email, password)).resolves.not.toThrow();
      const tokenPair = await authService.login(email, password);
      expect(
        tokenService.verifyRefreshToken(tokenPair.refresh_token)
      ).resolves.not.toThrow();
      expect(
        tokenService.verifyAccessToken(tokenPair.access_token)
      ).resolves.not.toThrow();
    });

    it("Should throw error if email is invalid", async () => {
      await expect(
        authService.login("wrong@mail.com", password)
      ).rejects.toThrow();
    });

    it("Should throw error if password is invalid", async () => {
      await expect(authService.login(email, "wrong")).rejects.toThrow();
    });

    it("Should throw error if credentials are invalid", async () => {
      await expect(
        authService.login("wrong@wrong.com", "wrong")
      ).rejects.toThrow();
    });
  });

  describe(".generateVerificationCode", () => {
    it("Should generate random verification code", () => {
      const firstCode = authService.generateVerificationCode();
      const secondCode = authService.generateVerificationCode();
      expect(firstCode).not.toBe(secondCode);
    });

    it("Should generate a verification code with six digits", () => {
      const firstCode = authService.generateVerificationCode();
      expect(firstCode.length).toBe(6);
    });
  });

  describe(".sendRegisterVerification", () => {
    let mails: MailOptions[];
    let manager: EntityManager;

    beforeAll(async () => {
      await testHelper.clearDatabase();
      testHelper.clearMails();
      mails = testHelper.getMails();
      manager = testHelper.getManager();
      jest
        .spyOn(authService, "generateVerificationCode")
        .mockReturnValueOnce("123456");
      await authService.sendRegisterVerification("mail@mail.com", "data");
    });

    it("Should send verification email", async () => {
      expect(mails.length).toBe(1);
      expect(mails[0].to).toBe("mail@mail.com");
      expect(mails[0].html.includes("123456")).toBe(true);
    });

    it("Should create verification row in database", async () => {
      const verification = await manager.findOne(EmailVerification, {
        where: { email: "mail@mail.com" },
      });
      expect(verification).toBeDefined();
      expect(verification.code).toBe("123456");
      expect(verification.data).toBe("data");
      expect(verification.verified).toBe(false);
      expect(verification.type).toBe("register-verification");
    });

    it("Should remove existing verification before new one created", async () => {
      jest
        .spyOn(authService, "generateVerificationCode")
        .mockReturnValueOnce("654321");
      await authService.sendRegisterVerification("mail@mail.com", "data");
      const verification = await manager.findOne(EmailVerification, {
        where: { email: "mail@mail.com" },
      });
      expect(verification.code).toBe("654321");
    });
  });

  describe(".verifyVerification", () => {
    let verification: EmailVerification;
    let manager: EntityManager;

    beforeAll(async () => {
      await testHelper.clearDatabase();
      manager = testHelper.getManager();
    });

    it("Should throw exception if invalid input is given", async () => {
      jest
        .spyOn(authService, "generateVerificationCode")
        .mockReturnValueOnce("123456");
      await authService.sendRegisterVerification("mail@mail.com", "data");
      const verification = await testHelper
        .getManager()
        .findOne(EmailVerification, { where: { email: "mail@mail.com" } });
      await expect(
        authService.verifyVerification({
          id: verification.id,
          email: "mail@mail.com",
          code: "123457",
          type: "register-verification",
          expireSeconds: 180,
        })
      ).rejects.toThrow();
      await expect(
        authService.verifyVerification({
          id: verification.id,
          email: "mail1@mail.com",
          code: "123456",
          type: "register-verification",
          expireSeconds: 180,
        })
      ).rejects.toThrow();
      await expect(
        authService.verifyVerification({
          id: verification.id,
          email: "mail@mail.com",
          code: "123456",
          type: "login-verification" as VerificationType,
          expireSeconds: 180,
        })
      ).rejects.toThrow();
      await expect(
        authService.verifyVerification({
          id: "id",
          email: "mail@mail.com",
          code: "123456",
          type: "register-verification",
          expireSeconds: 180,
        })
      ).rejects.toThrow();
      await expect(
        authService.verifyVerification({
          id: "id",
          email: "mail1@mail.com",
          code: "123457",
          type: "login-verification" as VerificationType,
          expireSeconds: 180,
        })
      ).rejects.toThrow();
    });

    it("Should throw exception if verification is expired ", async () => {
      jest
        .spyOn(authService, "generateVerificationCode")
        .mockReturnValueOnce("123456");
      await authService.sendRegisterVerification("expired@mail.com", "data");
      const verification = await testHelper
        .getManager()
        .findOne(EmailVerification, { where: { email: "expired@mail.com" } });
      verification.createdAt = new Date(
        new Date().getTime() - 240 * 1000
      ).toUTCString();
      await manager.save(EmailVerification, verification);
      await expect(
        authService.verifyVerification({
          id: verification.id,
          email: "expired@mail.com",
          code: "123456",
          type: "register-verification",
          expireSeconds: 180,
        })
      ).rejects.toThrow();
    });

    it("Should verify", async () => {
      jest
        .spyOn(authService, "generateVerificationCode")
        .mockReturnValueOnce("123456");
      await authService.sendRegisterVerification("right@mail.com", "data");
      let verification = await testHelper
        .getManager()
        .findOne(EmailVerification, { where: { email: "right@mail.com" } });
      const returnedVerification = await authService.verifyVerification({
        id: verification.id,
        email: "right@mail.com",
        code: "123456",
        type: "register-verification",
        expireSeconds: 180,
      });
      verification = await testHelper
        .getManager()
        .findOne(EmailVerification, { where: { email: "right@mail.com" } });
      expect(returnedVerification).toBeInstanceOf(EmailVerification);
      expect(returnedVerification).toMatchObject(verification);
      expect(verification.verified).toBe(true);
    });
  });
});
