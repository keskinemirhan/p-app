import { Account } from "src/account/entities/account.entity";
import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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
