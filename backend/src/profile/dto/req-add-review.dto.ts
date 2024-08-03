import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUUID, Max, Min } from "class-validator";

export class ReqAddReview {
  @ApiProperty()
  @IsUUID()
  targetProfileId: string;

  @ApiProperty()
  @IsString()
  reviewTitle: string;

  @ApiProperty()
  @IsString()
  reviewText: string;

  @ApiProperty()
  @IsInt()
  @Max(5)
  @Min(1)
  collaborativeRating: number;

  @ApiProperty()
  @IsInt()
  @Max(5)
  @Min(1)
  skillRating: number;

  @ApiProperty()
  @IsInt()
  @Max(5)
  @Min(1)
  communicativeRating: number;
}
