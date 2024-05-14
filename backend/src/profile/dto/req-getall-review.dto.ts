import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class ReqGetallReview {
  @ApiProperty()
  @IsNumber()
  take: number;

  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  targetId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reviewTitle?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reviewText?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Max(5)
  @Min(1)
  collaborativeRating?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Max(5)
  @Min(1)
  skillRating?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Max(5)
  @Min(1)
  communicativeRating?: number;
}
