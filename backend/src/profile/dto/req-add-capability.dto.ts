import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReqAddCapability {
  @ApiProperty()
  @IsString()
  name: string;

}
