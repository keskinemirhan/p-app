import { ApiProperty } from "@nestjs/swagger";

export class ResRegisterDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  verificationId: string;
}
