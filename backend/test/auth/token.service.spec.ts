import { JwtService } from "@nestjs/jwt";
import { TestingModule } from "@nestjs/testing";
import { TokenService } from "src/auth/token.service";
import { TestHelper } from "test/test.helper";

describe("TokenService", () => {
  let testHelper: TestHelper;
  let tokenService: TokenService;
  let moduleRef: TestingModule;
  let jwtService: JwtService;

  beforeAll(async () => {
    testHelper = new TestHelper();
    moduleRef = await testHelper.createTestApplication();
    await testHelper.clearDatabase();
    tokenService = moduleRef.get<TokenService>(TokenService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await testHelper.clearDatabase();
    await testHelper.closeApp();
  });

  describe(".createRefreshToken", () => {
    it("Should create refresh token", async () => {
      const token = await tokenService.createRefreshToken({ data: "here" });
      expect(() => jwtService.verify(token)).not.toThrow();
    });

    it("Should create refresh token with payload", async () => {
      const token = await tokenService.createRefreshToken({ data: "here" });
      expect(() => jwtService.verify(token)).not.toThrow();
      expect(jwtService.verify(token)).toMatchObject({ data: "here" });
    });
  });

  describe(".createAccessToken", () => {
    it("Should create access token", async () => {
      const token = await tokenService.createAccessToken({ data: "here" });
      expect(() => jwtService.verify(token)).not.toThrow();
    });

    it("Should create access token with payload", async () => {
      const token = await tokenService.createAccessToken({ data: "here" });
      expect(() => jwtService.verify(token)).not.toThrow();
      expect(jwtService.verify(token)).toMatchObject({ data: "here" });
    });
  });

  describe(".createPair", () => {
    it("Should create token pair", async () => {
      const pair = await tokenService.createPair({ data: "here" });
      expect(pair).toBeDefined();
      expect(pair.access_token).toBeDefined();
      expect(pair.refresh_token).toBeDefined();
      const { access_token, refresh_token } = pair;
      expect(() => jwtService.verify(access_token)).not.toThrow();
      expect(() => jwtService.verify(refresh_token)).not.toThrow();
    });

    it("Should create token pair with payload", async () => {
      const pair = await tokenService.createPair({ data: "here" });
      expect(pair).toBeDefined();
      expect(pair.access_token).toBeDefined();
      expect(pair.refresh_token).toBeDefined();
      const { access_token, refresh_token } = pair;
      expect(() => jwtService.verify(access_token)).not.toThrow();
      expect(jwtService.verify(access_token)).toMatchObject({ data: "here" });
      expect(() => jwtService.verify(refresh_token)).not.toThrow();
      expect(jwtService.verify(refresh_token)).toMatchObject({ data: "here" });
    });
  });

  describe(".verifyToken", () => {
    let access_token: string;
    let refresh_token: string;
    let invalid_token: string;
    let random_token: string;
    beforeAll(async () => {
      access_token = await tokenService.createAccessToken({ data: "data" });
      refresh_token = await tokenService.createRefreshToken({});
      random_token = jwtService.sign({}, { secret: "incorrect" });
      invalid_token = "invalid";
    });
    it("Should accept valid token", async () => {
      expect(tokenService.verifyToken(access_token)).resolves.not.toThrow();
      expect(tokenService.verifyToken(refresh_token)).resolves.not.toThrow();
    });

    it("Should reject invalid token", async () => {
      expect(tokenService.verifyToken(invalid_token)).rejects.toThrow();
      expect(tokenService.verifyToken(random_token)).rejects.toThrow();
    });

    it("Should return payload", async () => {
      await expect(
        tokenService.verifyToken(access_token),
      ).resolves.not.toThrow();
      await expect(
        tokenService.verifyToken(access_token),
      ).resolves.toMatchObject({ data: "data" });
    });
  });

  describe(".verifyAccessToken", () => {
    let access_token: string;
    let refresh_token: string;
    let invalid_token: string;
    let random_token: string;
    beforeAll(async () => {
      access_token = await tokenService.createAccessToken({ data: "data" });
      refresh_token = await tokenService.createRefreshToken({});
      random_token = jwtService.sign({}, { secret: "incorrect" });
      invalid_token = "invalid";
    });
    it("Should accept valid access token", async () => {
      expect(
        tokenService.verifyAccessToken(access_token),
      ).resolves.not.toThrow();
    });

    it("Should reject invalid access token", async () => {
      expect(tokenService.verifyAccessToken(refresh_token)).rejects.toThrow();
      expect(tokenService.verifyAccessToken(invalid_token)).rejects.toThrow();
      expect(tokenService.verifyAccessToken(random_token)).rejects.toThrow();
    });

    it("Should return payload", async () => {
      await expect(
        tokenService.verifyAccessToken(access_token),
      ).resolves.not.toThrow();
      await expect(
        tokenService.verifyAccessToken(access_token),
      ).resolves.toMatchObject({ data: "data" });
    });
  });

  describe(".verifyRefreshToken", () => {
    let access_token: string;
    let refresh_token: string;
    let invalid_token: string;
    let random_token: string;
    beforeAll(async () => {
      access_token = await tokenService.createAccessToken({});
      refresh_token = await tokenService.createRefreshToken({ data: "data" });
      random_token = jwtService.sign({}, { secret: "incorrect" });
      invalid_token = "invalid";
    });
    it("Should accept valid refresh_token token", async () => {
      expect(
        tokenService.verifyRefreshToken(refresh_token),
      ).resolves.not.toThrow();
    });

    it("Should reject invalid refresh token", async () => {
      expect(tokenService.verifyRefreshToken(access_token)).rejects.toThrow();
      expect(tokenService.verifyRefreshToken(invalid_token)).rejects.toThrow();
      expect(tokenService.verifyRefreshToken(random_token)).rejects.toThrow();
    });

    it("Should return payload", async () => {
      await expect(
        tokenService.verifyRefreshToken(refresh_token),
      ).resolves.not.toThrow();
      await expect(
        tokenService.verifyRefreshToken(refresh_token),
      ).resolves.toMatchObject({ data: "data" });
    });
  });
});
