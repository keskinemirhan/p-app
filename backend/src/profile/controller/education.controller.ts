import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { Role } from "src/auth/decorators/role.decorator";
import { ProfileService } from "../profile.service";
import { EducationService } from "../service/education.service";
import { ReqGetallAttr } from "../dto/req-getall-attr.dto";
import { ReqAddEducation } from "../dto/req-add-education.dto";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { Account } from "src/account/entities/account.entity";
import { isUUID } from "class-validator";
import { generateException } from "src/exception/exception";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResGetallEducation } from "../dto/res-getall-education.dto";
import { Education } from "../entities/education.entity";

@ApiTags("Education")
@Controller("education")
export class EducationController {
  constructor(
    private educationService: EducationService,
    private profileService: ProfileService,
  ) {}

  @ApiResponse({
    type: ResGetallEducation,
  })
  @ApiBody({
    type: ReqGetallAttr,
  })
  @Role("account")
  @Get()
  async getEducationsByProfile(@Body() reqGetallAttr: ReqGetallAttr) {
    const { profileId, take, page } = reqGetallAttr;
    const accounts = await this.educationService.getAll(page, take, {
      where: { profile: { id: profileId } },
      order: { startDate: "DESC" },
    });
    return accounts;
  }

  @ApiResponse({
    type: Education,
  })
  @ApiBody({
    type: ReqAddEducation,
  })
  @Role("account")
  @Post()
  async addEducation(
    @Body() reqAddEducation: ReqAddEducation,
    @CurrentAccount() account: Account,
  ) {
    const { name, startDate, endDate } = reqAddEducation;
    const profile = await this.profileService.getOne({
      account: { id: account.id },
    });
    const education = await this.educationService.create({
      name,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      profile,
    });
    return this.educationService.getOne({ id: education.id });
  }

  @ApiResponse({
    type: Education,
  })
  @ApiParam({
    name: "id",
    format: "UUID",
  })
  @Role("account")
  @Delete(":id")
  async deleteEducation(
    @Param("id") id: string,
    @CurrentAccount() account: Account,
  ) {
    const control = isUUID(id);
    if (!control)
      throw new NotFoundException(generateException("EDUCATION_NOT_FOUND"));
    const profile = await this.profileService.getOne({
      account: { id: account.id },
    });
    const education = await this.educationService.getOne({
      profile: { id: profile.id },
      id,
    });
    await this.educationService.remove({ id: education.id });
    return education;
  }
}
