import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class EmailVerification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  data: string;

  @Column()
  type: string;

  @Column()
  code: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: string;

  @Column()
  verified: boolean;
}
