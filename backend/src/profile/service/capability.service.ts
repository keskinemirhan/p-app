import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/model/crud-service";
import { Capability } from "../entities/capability.entity";

@Injectable()
export class CapabilityService extends CrudService<Capability>  {
  constructor(@InjectRepository(Capability) private capabilityRepo: Repository<Capability>) {
    super(capabilityRepo,"CAPABILITY_NOT_FOUND"); 
  }
}
