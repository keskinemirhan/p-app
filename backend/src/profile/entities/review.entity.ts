import { AfterInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn, getRepository } from "typeorm";
import { Profile } from "./profile.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  author: Profile;

  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  target: Profile;

  @Column()
  reviewText: string;

  @Column()
  collaborativeRating: number;

  @Column()
  skillRating: number;

  @Column()
  communicativeRating: number;


}
