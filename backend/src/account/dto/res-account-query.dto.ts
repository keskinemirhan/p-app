import { ApiProperty } from "@nestjs/swagger";
import { QueryResultPartialDto } from "src/model/query-result.dto";
import { Account } from "../entities/account.entity";

export class ResAccountQueryDto extends QueryResultPartialDto {
  @ApiProperty({ isArray: true, type: Account })
  result: Account[];
}
