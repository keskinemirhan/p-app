import { ApiProperty } from "@nestjs/swagger";
import { QueryResultPartialDto } from "src/model/query-result.dto";
import { Reference } from "../entities/reference.entity";

export class ResGetallReference extends QueryResultPartialDto {
  @ApiProperty({ isArray: true, type: Reference })
  result: Reference[];
}
