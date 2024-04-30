import { Controller, Get } from "@nestjs/common";
import { ProfileService } from "../profile.service";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { Account } from "src/account/entities/account.entity";
import { Role } from "src/auth/decorators/role.decorator";

@Controller("profile")
export class ProfileController {
  constructor(private profileService: ProfileService) { }

  @Role("account")
  @Get()
  async getMyProfile(@CurrentAccount() account: Account) {

    return this.profileService.getOne({ account: { id: account.id } });

  }
}
