import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Experience } from "../entities/experience.entity";
import { CrudService } from "src/model/crud-service";

@Injectable()
export class ExperienceService extends CrudService<Experience>  {
  constructor(@InjectRepository(Experience) private experienceRepo: Repository<Experience>) {
    super(experienceRepo,"EXPERIENCE_NOT_FOUND"); 
  }
}
