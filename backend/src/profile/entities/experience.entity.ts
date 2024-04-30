import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { BaseAttribute } from "./base-attr.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Experience extends BaseAttribute {
  @ApiProperty()
  @Column()
  companyName: string;

  @ApiProperty()
  @Column()
  position: string;

  @ApiProperty()
  @Column({ type: "date" })
  startDate: Date;

  @ApiProperty()
  @Column({ type: "date", nullable: true })
  endDate: Date;


}
