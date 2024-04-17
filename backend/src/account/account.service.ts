import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Account } from "./entities/account.entity";
import { hash } from "bcrypt";
import { generateException } from "src/exception/exception";
import { QueryService } from "src/model/query-service";



@Injectable()
export class AccountService extends QueryService<Account> implements OnModuleInit {
  constructor(@InjectRepository(Account) private accountRepo: Repository<Account>) {
    super(accountRepo, "ACC_NOT_FOUND");
  }
  async onModuleInit() {
    try {
      await this.getOne({ email: "admin@admin.com" });
    } catch {
      await this.create({ email: "admin@admin.com", password: "admin", isEmailVerified: true, isAdmin: true })

    }
  }



  async create(model: Partial<Account>) {

    if (model.email) {
      const foundAccount = await this.accountRepo.findOne({ where: { email: model.email } });
      if (foundAccount) throw new BadRequestException(generateException("EMAIL_EXISTS"));
    }
    if (model.password) {
      model.password = await hash(model.password, 10);
    }
    const account = this.accountRepo.create(model);
    return this.accountRepo.save(account);
  }

  async update(id: string, model: Partial<Account>) {
    const account = await this.accountRepo.findOne({ where: { id } });
    if (model.email && model.email !== account.email) {
      const existingEmail = await this.accountRepo.findOne({ where: { email: model.email } });
      if (existingEmail) throw new BadRequestException(generateException("EMAIL_EXISTS"));
    }
    if (model.password && model.password !== account.password) {
      account.password = await hash(model.password, 10);
    }
    if (!account) throw new NotFoundException(generateException("ACC_NOT_FOUND"));
    model.id = id;
    const updated = await this.accountRepo.save(model)
    return this.accountRepo.findOne({ where: { id: updated.id } });
  }

  async delete(id: string) {
    const account = await this.accountRepo.findOne({ where: { id } });
    if (!account) throw new NotFoundException("ACC_NOT_FOUND");
    const removed = this.accountRepo.remove(account);
    return removed;
  }
}
