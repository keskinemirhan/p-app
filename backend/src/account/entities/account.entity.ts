import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Account {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ApiProperty()
  @Column({ default: false })
  isEmailVerified: boolean;

  @Expose({ groups: ["admin"] })
  @ApiProperty()
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({ type: () => Profile })
  @OneToOne(() => Profile, (profile) => profile.account)
  @JoinColumn()
  profile: Profile;
}
