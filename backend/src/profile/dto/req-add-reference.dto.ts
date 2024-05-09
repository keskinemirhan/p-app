import { IsUUID } from "class-validator";

export class ReqAddReference {
  @IsUUID()
  referenceProfileId: string;
}

