import { IsInt, IsNumber } from "class-validator";

export class ReqQueryAccountDto {
  @IsInt()
  @IsNumber()
  take: number;

  @IsInt()
  @IsNumber()
  page: number;
}
