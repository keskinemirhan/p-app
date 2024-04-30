import { Injectable } from "@nestjs/common";
import { Education } from "../entities/education.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/model/crud-service";

@Injectable()
export class EducationService extends CrudService<Education>  {
  constructor(@InjectRepository(Education) private educationRepo: Repository<Education>) {
    super(educationRepo,"EDUCATION_NOT_FOUND"); 
  }
}
