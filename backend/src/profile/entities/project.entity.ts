import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  repoLink: string;

  @Column()
  role: string;

  @Column()
  isParticipatingNow: boolean;

  @ManyToOne(() => Profile, (profile) => profile.projects)
  profile: Profile;


}

