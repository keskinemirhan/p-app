import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Profile } from "./profile.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Review {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: () => Profile })
  @ManyToOne(() => Profile)
  author: Profile;

  @ApiProperty({ type: () => Profile })
  @ApiProperty()
  @ManyToOne(() => Profile)
  target: Profile;

  @ApiProperty()
  @Column()
  reviewTitle: string;

  @ApiProperty()
  @Column()
  reviewText: string;

  @ApiProperty()
  @Column("float")
  collaborativeRating: number;

  @ApiProperty()
  @Column("float")
  skillRating: number;

  @ApiProperty()
  @Column("float")
  communicativeRating: number;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
