import { ApiProperty } from "@nestjs/swagger";
import { Education } from "../entities/education.entity";
import { QueryResultPartialDto } from "src/model/query-result.dto";

export class ResGetallEducation extends QueryResultPartialDto {
  @ApiProperty({ isArray: true, type: Education })
  result: Education[];
}
