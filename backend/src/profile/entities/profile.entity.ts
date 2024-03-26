import { Account } from "src/account/entities/account.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Capability } from "./capability.entity";
import { ContactInfo } from "./contact-info.entity";
import { Education } from "./education.entity";
import { Experience } from "./experience.entity";
import { Project } from "./project.entity";
import { Reference } from "./reference.entity";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;


  @Column({ nullable: true })
  collaborativeRating: number;

  @Column({ nullable: true })
  skillRating: number;

  @Column({ nullable: true })
  communicativeRating: number;

  @OneToOne(() => Account, (account) => account.profile)
  account: Account;

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.profile)
  @JoinColumn()
  contactInfo: ContactInfo;

  @OneToMany(() => Education, (education) => education.profile)
  educations: Education[];

  @OneToMany(() => Capability, (capability) => capability.profile)
  capabilities: Capability[];

  @OneToMany(() => Experience, (experience) => experience.profile)
  experiences: Experience[];

  @OneToMany(() => Project, (project) => project.profile)
  projects: Project[];

  @OneToMany(() => Reference, (reference) => reference.profile)
  references: Reference[];

}
