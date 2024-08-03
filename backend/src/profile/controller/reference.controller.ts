import {
  BadRequestException,
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
import { ReqGetallAttr } from "../dto/req-getall-attr.dto";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { Account } from "src/account/entities/account.entity";
import { isUUID } from "class-validator";
import { generateException } from "src/exception/exception";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Reference } from "../entities/reference.entity";
import { ReferenceService } from "../service/reference.service";
import { ResGetallReference } from "../dto/res-getall-reference.dto";
import { ReqAddReference } from "../dto/req-add-reference.dto";

@ApiTags("Reference")
@Controller("reference")
export class ReferenceController {
  constructor(
    private referenceService: ReferenceService,
    private profileService: ProfileService,
  ) {}

  @ApiResponse({
    type: ResGetallReference,
  })
  @ApiBody({
    type: ReqGetallAttr,
  })
  @Role("account")
  @Get()
  async getReferencesByProfileId(@Body() reqGetallAttr: ReqGetallAttr) {
    const { profileId, take, page } = reqGetallAttr;
    const references = await this.referenceService.getAll(page, take, {
      where: { profile: { id: profileId } },
      relations: { referenceProfile: true },
    });
    return references;
  }

  @ApiResponse({
    type: Reference,
  })
  @ApiBody({
    type: ReqAddReference,
  })
  @Role("account")
  @Post()
  async addReference(
    @Body() reqAddReference: ReqAddReference,
    @CurrentAccount() account: Account,
  ) {
    const { referenceProfileId } = reqAddReference;
    const profile = await this.profileService.getOne({
      account: { id: account.id },
    });
    if (referenceProfileId === profile.id)
      throw new BadRequestException(
        generateException("CANNOT_REFERENCE_ITSELF"),
      );
    const referenceProfile = await this.profileService.getOne({
      id: referenceProfileId,
    });
    const reference = await this.referenceService.create({
      profile,
      referenceProfile,
    });
    return this.referenceService.getOne({ id: reference.id });
  }

  @ApiResponse({
    type: Reference,
  })
  @ApiParam({
    name: "id",
    format: "UUID",
  })
  @Role("account")
  @Delete(":id")
  async deleteReference(
    @Param("id") id: string,
    @CurrentAccount() account: Account,
  ) {
    const control = isUUID(id);
    if (!control)
      throw new NotFoundException(generateException("REFERENCE_NOT_FOUND"));
    const profile = await this.profileService.getOne({
      account: { id: account.id },
    });
    const reference = await this.referenceService.getOne(
      { profile: { id: profile.id }, id },
      { referenceProfile: true },
    );
    await this.referenceService.remove({ id: reference.id });
    return reference;
  }
}
