import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileDescriptor } from "./file-descriptor.entity";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";

@Module({
  imports: [TypeOrmModule.forFeature([FileDescriptor])],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
