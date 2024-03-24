import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class ReqRefreshDto {
  @ApiProperty()
  @IsJWT()
  refresh_token: string;
}
