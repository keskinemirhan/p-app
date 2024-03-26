import { Account } from "src/account/entities/account.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { BaseAttribute } from "./base-attr.entity";

@Entity()
export class Reference extends BaseAttribute {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  referenceAccount: Account;
}

