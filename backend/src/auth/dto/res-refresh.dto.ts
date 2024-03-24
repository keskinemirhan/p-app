import { ApiProperty } from "@nestjs/swagger";

export class ResRefreshDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
