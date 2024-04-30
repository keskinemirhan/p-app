import { Column, Entity } from "typeorm";
import { BaseAttribute } from "./base-attr.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Capability extends BaseAttribute {
  @ApiProperty()
  @Column()
  name: string;
}
