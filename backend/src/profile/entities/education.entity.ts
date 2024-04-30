import { Column, Entity} from "typeorm";
import { BaseAttribute } from "./base-attr.entity";

@Entity()
export class Education extends BaseAttribute {
  @Column()
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

}
