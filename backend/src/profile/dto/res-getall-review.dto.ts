import { ApiProperty } from "@nestjs/swagger";
import { QueryResultPartialDto } from "src/model/query-result.dto";
import { Review } from "../entities/review.entity";

export class ResGetallReview extends QueryResultPartialDto {
  @ApiProperty({ isArray: true, type: Review })
  result: Review[];
}
