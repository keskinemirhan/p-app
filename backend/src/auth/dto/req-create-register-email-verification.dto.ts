import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class ReqCreateRegisterEmailVerificationDto {
  @ApiProperty()
  @IsJWT()
  access_token: string;
}
