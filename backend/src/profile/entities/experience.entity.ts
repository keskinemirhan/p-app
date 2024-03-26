import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { BaseAttribute } from "./base-attr.entity";

@Entity()
export class Experience extends BaseAttribute {
  @Column()
  companyName: string;

  @Column()
  position: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date;


}
