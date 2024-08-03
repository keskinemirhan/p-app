import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsString } from "class-validator";

export class ReqCreateAccountDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsBoolean()
  @ApiProperty()
  isEmailVerified: boolean;

  @IsBoolean()
  @ApiProperty()
  isAdmin: boolean;
}
