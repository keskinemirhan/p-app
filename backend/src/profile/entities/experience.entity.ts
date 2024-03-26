import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Experience {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  companyName: string;

  @Column()
  position: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date;

  @ManyToOne(() => Profile, (profile) => profile.experiences)
  profile: Profile;


}
