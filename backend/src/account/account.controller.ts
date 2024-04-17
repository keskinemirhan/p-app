import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from "@nestjs/common";
import { AccountService } from "./account.service";
import { Role } from "src/auth/decorators/role.decorator";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResAccountQueryDto } from "./dto/res-account-query.dto";
import { Account } from "./entities/account.entity";
import { ReqUpdateAccountDto } from "./dto/req-update.account.dto";
import { ReqCreateAccountDto } from "./dto/req-create-account.dto";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { ReqQueryAccountDto } from "./dto/req-query-account.dto";
import { isJWT, isUUID } from "class-validator";
import { generateException } from "src/exception/exception";

@ApiTags("Account")
@Controller("account")
export class AccountController {
  constructor(private accountService: AccountService) {
  }

  // -- Admin controllers

  @Role('admin')
  @ApiResponse({ type: Account })
  @Get('admin/:id')
  async getAccount(@Param("id") id: string) {
    const control = isUUID(id);
    if (!control) throw new NotFoundException(generateException("ACC_NOT_FOUND"));
    return await this.accountService.getOne({ id });
  }

  @Role('admin')
  @ApiResponse({ type: ResAccountQueryDto })
  @Get('admin')
  async queryAccount(@Body() reqQueryAccountDto: ReqQueryAccountDto) {
    const { page, take } = reqQueryAccountDto;
    return await this.accountService.getAll(page, take);
  }

  @Role('admin')
  @ApiResponse({ type: Account })
  @ApiBody({ type: ReqUpdateAccountDto })
  @Patch("admin/:id")
  async updateAccount(@Param('id') id: string, @Body() updateDto: ReqUpdateAccountDto) {
    return await this.accountService.update(id, updateDto);
  }

  @Role('admin')
  @ApiResponse({ type: Account })
  @ApiBody({ type: ReqCreateAccountDto })
  @Post('admin')
  async createAccount(@Body() createDto: ReqCreateAccountDto) {
    return await this.accountService.create(createDto);
  }

  @Role('admin')
  @ApiResponse({ type: Account })
  @Delete('admin/:id')
  async deleteAccount(@Param('id') id: string) {
    return await this.accountService.delete(id);
  }

  // -- User controllers (Only Reading - For Updates -> AuthController)

  @Role('account')
  @ApiResponse({ type: Account })
  @Get('me')
  async getMyAccount(@CurrentAccount() account: Account) {
    return await this.accountService.getOne({ id: account.id })
  }
}


