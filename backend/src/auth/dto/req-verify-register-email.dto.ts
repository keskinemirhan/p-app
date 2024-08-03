import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlpha,
  IsAlphanumeric,
  IsJWT,
  IsNotEmpty,
  IsString,
  IsUUID,
} from "class-validator";

export class ReqVerifyRegisterEmailDto {
  @ApiProperty()
  @IsUUID()
  verificationId: string;

  @ApiProperty()
  @IsJWT()
  access_token: string;

  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  @IsString()
  code: string;
}
