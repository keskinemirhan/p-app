import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileDescriptor } from "./file-descriptor.entity";
import { Repository } from "typeorm";
import { createReadStream, existsSync, unlinkSync } from "fs";
import { generateException } from "src/exception/exception";

@Injectable()
export class FileService {
  constructor(@InjectRepository(FileDescriptor) private fileDescRepo: Repository<FileDescriptor>) { }

  async uploadFile(file: Express.Multer.File, accessInfo?: string) {
    const name = file.filename;
    const localPath = file.path;
    const mimeType = file.mimetype;
    const createdFileDesc = await this.fileDescRepo.save({ name, localPath, accessInfo, mimeType });
    return createdFileDesc;
  }

  async removeFile(name: string) {
    const fileDesc = await this.fileDescRepo.findOne({
      where: {
        name
      }
    });

    if (fileDesc) {
      if (existsSync(fileDesc.localPath)) {
        unlinkSync(fileDesc.localPath);
      }
      await this.fileDescRepo.remove(fileDesc);
    }
    return fileDesc;
  }

  async getFile(name: string) {
    const file = await this.fileDescRepo.findOne({ where: { name } });
    if (!file) throw new BadRequestException(generateException("FILE_NOT_FOUND"));
    return { ...file, readStream: createReadStream(file.localPath) };
  }

}
