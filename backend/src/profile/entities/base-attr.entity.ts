import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class BaseAttribute {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.capabilities, {
    onDelete: "CASCADE",
  })
  profile: Profile;
}
