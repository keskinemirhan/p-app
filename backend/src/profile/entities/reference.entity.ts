import { Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { Profile } from "./profile.entity";
import { BaseAttribute } from "./base-attr.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Reference extends BaseAttribute {
  @ApiProperty({ type: () => Profile })
  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  @JoinColumn()
  referenceProfile: Relation<Profile>;
}
