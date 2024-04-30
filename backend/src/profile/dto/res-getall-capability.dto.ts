import { ApiProperty } from "@nestjs/swagger";
import { QueryResultPartialDto } from "src/model/query-result.dto";
import { Capability } from "../entities/capability.entity";

export class ResGetallCapability extends QueryResultPartialDto {
  @ApiProperty({ isArray: true, type: Capability })
  result: Capability[];
}
