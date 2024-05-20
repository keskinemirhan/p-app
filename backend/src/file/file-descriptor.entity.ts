import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FileDescriptor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  accessInfo: string;

  @Column()
  mimeType: string;

  @Column()
  localPath: string;
}
