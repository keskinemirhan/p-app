import { Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile)
  createdBy: Profile;

  @ManyToOne(() => Profile)
  to: Profile;

  @Column()
  reviewText: string;

  @Column()
  collaborativeRating: number;

  @Column()
  skillRating: number;

  @Column()
  communicativeRating: number;
}
