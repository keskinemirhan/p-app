import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class ReqUpdateReview {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  reviewTitle?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  reviewText?: string;

  @ApiProperty()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  collaborativeRating?: number;

  @ApiProperty()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  skillRating?: number;

  @ApiProperty()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  communicativeRating?: number;
}
