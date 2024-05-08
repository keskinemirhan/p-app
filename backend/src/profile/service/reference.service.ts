import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Reference } from "../entities/reference.entity";
import { CrudService } from "src/model/crud-service";

@Injectable()
export class ReferenceService extends CrudService<Reference>  {
  constructor(@InjectRepository(Reference) private referenceRepo: Repository<Reference>) {
    super(referenceRepo,"REFERENCE_NOT_FOUND"); 
  }
}
