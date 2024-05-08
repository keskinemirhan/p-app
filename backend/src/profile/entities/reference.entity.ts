import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Profile } from "./profile.entity";
import { BaseAttribute } from "./base-attr.entity";

@Entity()
export class Reference extends BaseAttribute {
  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  @JoinColumn()
  referenceAccount: Profile;
}

