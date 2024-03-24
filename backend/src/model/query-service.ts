import { NotFoundException } from "@nestjs/common";
import { ExceptionCode } from "src/exception/exception";
import { FindOptionsWhere, Repository } from "typeorm";

export class QueryService<T> {
  repo: Repository<T>;
  notFoundCode: ExceptionCode;

  constructor(repo: Repository<T>, notFoundCode: ExceptionCode) {
    this.repo = repo;
    this.notFoundCode = notFoundCode;
  }

  async getOne(where: FindOptionsWhere<T>) {
    const item = await this.repo.findOne({ where });
    if (!item) throw new NotFoundException(this.notFoundCode);
    return item;
  }

  async getAll(page: number, quantity: number, where?: FindOptionsWhere<T>) {
    const [result, total] = await this.repo.findAndCount({ where, take: quantity, skip: (page - 1) * quantity })
    const lastPage = Math.ceil(total / quantity);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      result,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    }
  }


}

