import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { QueryService } from "./query-service";
import { ExceptionCode } from "src/exception/exception";

export class CrudService<T> extends QueryService<T> {

  constructor(repo: Repository<T>, notFoundCode: ExceptionCode) {
    super(repo, notFoundCode);
  }

  async update(where: FindOptionsWhere<T>, model: DeepPartial<T>) {
    const entity = await this.getOne(where);
    Object.assign(entity, model);
    return await this.repo.save(entity);

  }

  async create(model: DeepPartial<T>) {
    return await this.repo.save(model);
  }

  async remove(where: FindOptionsWhere<T>) {
    const entities = await this.repo.find({ where });
    return await this.repo.remove(entities);
  }

}
