import { Column, Entity} from "typeorm";
import { BaseAttribute } from "./base-attr.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Education extends BaseAttribute {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  endDate: Date;

}
