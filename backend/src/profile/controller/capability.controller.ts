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
import { ReqGetallAttr } from "../dto/req-getall-attr.dto";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { Account } from "src/account/entities/account.entity";
import { isUUID } from "class-validator";
import { generateException } from "src/exception/exception";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Capability } from "../entities/capability.entity";
import { CapabilityService } from "../service/capability.service";
import { ResGetallCapability } from "../dto/res-getall-capability.dto";
import { ReqAddCapability } from "../dto/req-add-capability.dto";

@ApiTags("Capability")
@Controller("capability")
export class CapabilityController {
  constructor(
    private capabilityService: CapabilityService,
    private profileService: ProfileService,
  ) {}

  @ApiResponse({
    type: ResGetallCapability,
  })
  @ApiBody({
    type: ReqGetallAttr,
  })
  @Role("account")
  @Get()
  async getCapabilityByProfileId(@Body() reqGetallAttr: ReqGetallAttr) {
    const { profileId, take, page } = reqGetallAttr;
    const accounts = await this.capabilityService.getAll(page, take, {
      where: { profile: { id: profileId } },
      order: { name: "ASC" },
    });
    return accounts;
  }

  @ApiResponse({
    type: Capability,
  })
  @ApiBody({
    type: ReqAddCapability,
  })
  @Role("account")
  @Post()
  async addCapability(
    @Body() reqAddCapability: ReqAddCapability,
    @CurrentAccount() account: Account,
  ) {
    const { name } = reqAddCapability;
    const profile = await this.profileService.getOne({
      account: { id: account.id },
    });
    const capability = await this.capabilityService.create({ name, profile });
    return this.capabilityService.getOne({ id: capability.id });
  }

  @ApiResponse({
    type: Capability,
  })
  @ApiParam({
    name: "id",
    format: "UUID",
  })
  @Role("account")
  @Delete(":id")
  async deleteCapability(
    @Param("id") id: string,
    @CurrentAccount() account: Account,
  ) {
    const control = isUUID(id);
    if (!control)
      throw new NotFoundException(generateException("CAPABILITY_NOT_FOUND"));
    const profile = await this.profileService.getOne({
      account: { id: account.id },
    });
    const capability = await this.capabilityService.getOne({
      profile: { id: profile.id },
      id,
    });
    await this.capabilityService.remove({ id: capability.id });
    return capability;
  }
}
