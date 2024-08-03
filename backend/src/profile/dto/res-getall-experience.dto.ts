import { ApiProperty } from "@nestjs/swagger";
import { QueryResultPartialDto } from "src/model/query-result.dto";
import { Experience } from "../entities/experience.entity";

export class ResGetallExperience extends QueryResultPartialDto {
  @ApiProperty({ isArray: true, type: Experience })
  result: Experience[];
}
