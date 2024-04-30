import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { Role } from "src/auth/decorators/role.decorator";
import { ProfileService } from "../profile.service";
import { ReqGetallAttr } from "../dto/req-getall-attr.dto";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { Account } from "src/account/entities/account.entity";
import { isUUID } from "class-validator";
import { generateException } from "src/exception/exception";
import { ExperienceService } from "../service/experience.service";
import { ReqAddExperience } from "../dto/req-add-experience.dto";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Experience } from "../entities/experience.entity";
import { ResGetallExperience } from "../dto/res-getall-experience.dto";

@ApiTags("Experience")
@Controller("experience")
export class ExperienceController {
  constructor(private experienceService: ExperienceService, private profileService: ProfileService) { }

  @ApiResponse({
    type: ResGetallExperience
  })
  @ApiBody({
    type: ReqGetallAttr,
  })

  @Role("account")
  @Get()
  async getExperiencesByProfileId(@Body() reqGetallAttr: ReqGetallAttr) {
    const { profileId, take, page } = reqGetallAttr;
    const experiences = await this.experienceService.getAll(page, take, { where: { profile: { id: profileId } }, order: { startDate: "DESC" } });
    return experiences;
  }

  @ApiResponse({
    type: Experience,
  })
  @ApiBody({
    type: ReqAddExperience,
  })
  @Role("account")
  @Post()
  async addExperience(@Body() reqAddExperience: ReqAddExperience, @CurrentAccount() account: Account) {
    const { companyName, position, startDate, endDate } = reqAddExperience;
    const profile = await this.profileService.getOne({ account: { id: account.id } });
    const experience = await this.experienceService.create({ profile, companyName, position, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : undefined });
    return this.experienceService.getOne({ id: experience.id });
  }

  @ApiResponse({
    type: Experience,
  })
  @ApiParam({
    name: "id",
    format: "UUID",
  })
  @Role("account")
  @Delete(":id")
  async deleteEducation(@Param("id") id: string, @CurrentAccount() account: Account) {
    const control = isUUID(id);
    if (!control) throw new NotFoundException(generateException("EXPERIENCE_NOT_FOUND"));
    const profile = await this.profileService.getOne({ account: { id: account.id } });
    const experience = await this.experienceService.getOne({ profile: { id: profile.id }, id });
    await this.experienceService.remove({ id: experience.id });
    return experience;
  }
}
