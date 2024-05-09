import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Capability } from "./entities/capability.entity";
import { Education } from "./entities/education.entity";
import { Experience } from "./entities/experience.entity";
import { Profile } from "./entities/profile.entity";
import { Project } from "./entities/project.entity";
import { Reference } from "./entities/reference.entity";
import { Review } from "./entities/review.entity";
import { ProfileService } from "./profile.service";
import { EducationService } from "./service/education.service";
import { EducationController } from "./controller/education.controller";
import { AuthModule } from "src/auth/auth.module";
import { AccountModule } from "src/account/account.module";
import { ExperienceController } from "./controller/experience.controller";
import { ExperienceService } from "./service/experience.service";
import { ProfileController } from "./controller/profile.controller";
import { CapabilityService } from "./service/capability.service";
import { CapabilityController } from "./controller/capability.controller";
import { ProjectController } from "./controller/project.controller";
import { ProjectService } from "./service/project.service";
import { ReferenceService } from "./service/reference.service";
import { ReferenceController } from "./controller/reference.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Capability, Education, Experience, Profile, Project, Reference, Review]),
    forwardRef(() => AuthModule),
    forwardRef(() => AccountModule),
  ],
  providers: [ProfileService, EducationService, ExperienceService, CapabilityService, ProjectService, ReferenceService],
  controllers: [ProfileController, EducationController, ExperienceController, CapabilityController, ProjectController, ReferenceController],
  exports: [ProfileService]


})
export class ProfileModule { }
