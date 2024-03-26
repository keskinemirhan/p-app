import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { BaseAttribute } from "./base-attr.entity";

@Entity()
export class Capability extends BaseAttribute{
  @Column()
  name: string;
}
