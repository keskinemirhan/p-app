import { ApiProperty } from "@nestjs/swagger";

export class QueryResultPartialDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  nextPage: number;

  @ApiProperty()
  prevPage: number;

  @ApiProperty()
  lastPage: number;
}
