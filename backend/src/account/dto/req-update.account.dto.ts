import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class ReqUpdateAccountDto {

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  password: string;


  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isEmailVerified: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isAdmin: boolean;
}
