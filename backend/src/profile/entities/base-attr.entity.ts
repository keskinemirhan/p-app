import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class BaseAttribute {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.capabilities, {
    onDelete: "CASCADE"
  })
  profile: Profile;


}
