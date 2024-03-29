import { DeepPartial, FindOptionsWhere } from "typeorm";
import { QueryService } from "./query-service";

export class CrudService<T> extends QueryService<T> {

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
