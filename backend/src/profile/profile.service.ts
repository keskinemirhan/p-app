import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "./entities/profile.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CrudService } from "src/model/crud-service";
import { FileService } from "src/file/file.service";


@Injectable()
export class ProfileService extends CrudService<Profile> {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    private fileService: FileService,
  ) {
    super(profileRepo, "PROFILE_NOT_FOUND");
  }

  async shuffle(take: number) {
    const profiles = await this.profileRepo
      .createQueryBuilder()
      .select("*")
      .orderBy("RANDOM()")
      .execute();
    return profiles;
  }

  async uploadProfileImage(where: FindOptionsWhere<Profile>, file: Express.Multer.File) {
    const profile = await this.getOne(where);
    await this.fileService.removeFile(profile.profileImage);
    await this.fileService.uploadFile(file);
    profile.profileImage = file.filename;
    await this.update(where, profile);
    return await this.getOne(where);
  }

}
