import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Capability } from "./entities/capability.entity";
import { Education } from "./entities/education.entity";
import { Experience } from "./entities/experience.entity";
import { Profile } from "./entities/profile.entity";
import { Project } from "./entities/project.entity";
import { Reference } from "./entities/reference.entity";
import { Review } from "./entities/review.entity";
import { ProfileService } from "./profile.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Capability, Education, Experience, Profile, Project, Reference, Review]),
  ],
  providers: [ProfileService],
  exports: [ProfileService]


})
export class ProfileModule { }
