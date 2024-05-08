import { ApiProperty } from "@nestjs/swagger";
import { QueryResultPartialDto } from "src/model/query-result.dto";
import { Project } from "../entities/project.entity";

export class ResGetallProject extends QueryResultPartialDto {

  @ApiProperty({ isArray: true, type: Project})
  result: Project[]

}
