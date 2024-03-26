import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { profile } from "console";

@Entity()
export class Capability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Profile, (profile) => profile.capabilities)
  profile: Profile;

}
