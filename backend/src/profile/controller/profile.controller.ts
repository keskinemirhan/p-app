import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ProfileService } from "../profile.service";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { Account } from "src/account/entities/account.entity";
import { Role } from "src/auth/decorators/role.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { basename } from "path";

@Controller("profile")
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Role("account")
  @Get("me")
  async getMyProfile(@CurrentAccount() account: Account) {
    return this.profileService.getOne({ account: { id: account.id } });
  }

  @Role("account")
  @Post("profile-image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/profile-image",
        filename: (req, file, cb) => {
          cb(null, Date.now() + "." + basename(file.mimetype));
        },
      }),
    }),
  )
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: "image/*" })
        .addMaxSizeValidator({ maxSize: 5000000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @CurrentAccount() account: Account,
  ) {
    return this.profileService.uploadProfileImage(
      { account: { id: account.id } },
      file,
    );
  }

  @Role("account")
  @Delete("profile-image")
  async deleteProfileImage(@CurrentAccount() account: Account) {
    return this.profileService.removeProfileImage({
      account: { id: account.id },
    });
  }

  @Role("public")
  @Get()
  async shuffleProfile() {
    return await this.profileService.shuffle(30);
  }
}
