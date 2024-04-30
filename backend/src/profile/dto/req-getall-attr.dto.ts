import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID } from "class-validator";

export class ReqGetallAttr {
  @ApiProperty()
  @IsUUID()
  profileId: string;
  
  @ApiProperty()
  @IsNumber()
  take: number;

  @ApiProperty()
  @IsNumber()
  page: number;

}
