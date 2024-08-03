import { Column, Entity } from "typeorm";
import { BaseAttribute } from "./base-attr.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Project extends BaseAttribute {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  repoLink: string;

  @ApiProperty()
  @Column()
  role: string;

  @ApiProperty()
  @Column()
  isParticipatingNow: boolean;
}
