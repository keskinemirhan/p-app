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
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: 0, type: "float" })
  collaborativeRating: number;

  @Column({ default: 0, type: "float" })
  skillRating: number;

  @Column({ default: 0, type: "float" })
  communicativeRating: number;
  @Column({ default: 0, type: "float" })
  overallRating: number;

  @Column({ default: 0, type: "int" })
  reviewCount: number;

  @Column()
  birthDate: Date;

  @OneToOne(() => Account, (account) => account.profile, { onDelete: "CASCADE" })
  account: Account;

  @OneToMany(() => Education, (education) => education.profile)
  educations: Education[];

  @OneToMany(() => Capability, (capability) => capability.profile,)
  capabilities: Capability[];

  @OneToMany(() => Experience, (experience) => experience.profile)
  experiences: Experience[];

  @OneToMany(() => Project, (project) => project.profile)
  projects: Project[];

  @OneToMany(() => Reference, (reference) => reference.profile)
  references: Reference[];

  @OneToMany(() => Review, (review) => review.author)
  authoredReviews: Review[];

  @OneToMany(() => Review, (review) => review.target)
  targetReviews: Review[];
}  
