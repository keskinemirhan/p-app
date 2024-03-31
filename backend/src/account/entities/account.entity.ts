import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, Entity, IsNull, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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


  @ApiProperty()
  @Column({ default: false })
  isEmailVerified: boolean;

  @Expose({ groups: ["admin"] })
  @ApiProperty()
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty()
  @OneToOne(() => Profile, (profile) => profile.account)
  @JoinColumn()
  profile: Profile;


}
