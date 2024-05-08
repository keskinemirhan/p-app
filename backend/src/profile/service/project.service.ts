
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../entities/project.entity";
import { CrudService } from "src/model/crud-service";

@Injectable()
export class ProjectService extends CrudService<Project>  {
  constructor(@InjectRepository(Project) private projectRepo: Repository<Project>) {
    super(projectRepo,"PROJECT_NOT_FOUND"); 
  }
}
