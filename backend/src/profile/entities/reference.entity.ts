import { Account } from "src/account/entities/account.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Reference {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  referenceAccount: Account;

  @ManyToOne(() => Profile, (profile) => profile.experiences)
  profile: Profile;


}

