import { Column, Entity, OneToOne , PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class ContactInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Profile, (profile) => profile.contactInfo)
  profile: Profile;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  phoneNumber: string;

}
