import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "./entities/profile.entity";
import { Repository } from "typeorm";
import { CrudService } from "src/model/crud-service";

@Injectable()
export class ProfileService extends CrudService<Profile> {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {
    super(profileRepo, "PROFILE_NOT_FOUND");
  }
}
