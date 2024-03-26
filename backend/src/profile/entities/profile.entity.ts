import { Account } from "src/account/entities/account.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Capability } from "./capability.entity";
import { Education } from "./education.entity";
import { Experience } from "./experience.entity";
import { Project } from "./project.entity";
import { Reference } from "./reference.entity";
import { Review } from "./review.entity";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  contactEmail: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  collaborativeRating: number;

  @Column({ nullable: true })
  skillRating: number;

  @Column({ nullable: true })
  communicativeRating: number;

  @OneToOne(() => Account, (account) => account.profile, { onDelete: "CASCADE" })
  account: Account;

  @OneToMany(() => Education, (education) => education.profile, { cascade: true })
  educations: Education[];

  @OneToMany(() => Capability, (capability) => capability.profile, { cascade: true })
  capabilities: Capability[];

  @OneToMany(() => Experience, (experience) => experience.profile, { cascade: true })
  experiences: Experience[];

  @OneToMany(() => Project, (project) => project.profile, { cascade: true })
  projects: Project[];

  @OneToMany(() => Reference, (reference) => reference.profile, { cascade: true })
  references: Reference[];

  @OneToMany(() => Review, (review) => review.createdBy, { cascade: true })
  authoredReviews: Review[];

  @OneToMany(() => Review, (review) => review.createdBy, { cascade: true })
  targetReviews: Review[];
}  
