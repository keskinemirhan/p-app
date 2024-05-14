import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class ReqAddReference {
  @ApiProperty()
  @IsUUID()
  referenceProfileId: string;
}

