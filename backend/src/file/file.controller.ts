import { Controller, Get, Param, Res, StreamableFile } from "@nestjs/common";
import { FileService } from "./file.service";
import { Response } from "express";

@Controller("file")
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(":name")
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param("name") name: string,
  ) {
    const file = await this.fileService.getFile(name);
    res.set({
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename="${name}"`,
    });
    return new StreamableFile(file.readStream);
  }
}
