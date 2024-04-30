import { IsNumber, IsUUID } from "class-validator";

export class ReqGetallAttr {
  @IsUUID()
  profileId: string;
  
  @IsNumber()
  take: number;

  @IsNumber()
  page: number;

}
