import { Column, Entity } from "typeorm";
import { BaseAttribute } from "./base-attr.entity";

@Entity()
export class Project extends BaseAttribute {

  @Column()
  name: string;

  @Column({ nullable: true })
  repoLink: string;

  @Column()
  role: string;

  @Column()
  isParticipatingNow: boolean;


}

