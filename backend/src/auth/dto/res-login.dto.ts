import { ApiProperty } from "@nestjs/swagger";

export class ResLoginDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
