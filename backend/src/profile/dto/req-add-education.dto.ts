import { IsDateString, IsOptional, IsString } from "class-validator";

export class ReqAddEducation {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
