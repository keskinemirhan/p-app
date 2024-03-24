import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account } from "./entities/account.entity";
import { hash } from "bcrypt";
import { generateException } from "src/exception/exception";
import { QueryService } from "src/model/query-service";



@Injectable()
export class AccountService extends QueryService<Account> {
  constructor(@InjectRepository(Account) private accountRepo: Repository<Account>) {
    super(accountRepo, "ACC_NOT_FOUND");
  }

  private async modelCheck(model: Partial<Account>): Promise<Partial<Account>> {
    if (model.password) {
      const hashedPassword = await hash(model.password, 10);
      model.password = hashedPassword;
    }


    return model;
  }


  async create(model: Partial<Account>) {
    model = await this.modelCheck(model)
    if (model.email) {
      const foundAccount = await this.accountRepo.findOne({ where: { email: model.email } });
      if (foundAccount) throw new BadRequestException(generateException("EMAIL_EXISTS"));
    }
    const account = this.accountRepo.create(model);
    return this.accountRepo.save(account);
  }

  async update(id: string, model: Partial<Account>) {
    model = await this.modelCheck(model);
    const account = await this.accountRepo.findOne({ where: { id } });
    if (!account) throw new NotFoundException(generateException("ACC_NOT_FOUND"));
    const updated = await this.accountRepo.save(model)
    return updated;
  }

  async delete(id: string) {
    const account = await this.accountRepo.findOne({ where: { id } });
    if (!account) throw new NotFoundException("ACC_NOT_FOUND");
    const removed = this.accountRepo.remove(account);
    return removed;
  }
}
