import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Education {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ManyToOne(() => Profile, (profile) => profile.educations)
  profile: Profile;



}
