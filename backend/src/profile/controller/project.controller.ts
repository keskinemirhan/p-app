
import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { Role } from "src/auth/decorators/role.decorator";
import { ProfileService } from "../profile.service";
import { ReqGetallAttr } from "../dto/req-getall-attr.dto";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { Account } from "src/account/entities/account.entity";
import { isUUID } from "class-validator";
import { generateException } from "src/exception/exception";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Project } from "../entities/project.entity";
import { ProjectService } from "../service/project.service";
import { ResGetallProject } from "../dto/res-getall-project.dto";
import { ReqAddProject } from "../dto/req-add-project.dto";

@ApiTags("Project")
@Controller("project")
export class ProjectController {
  constructor(private projectService: ProjectService, private profileService: ProfileService) { }

  @ApiResponse({
    type: ResGetallProject
  })
  @ApiBody({
    type: ReqGetallAttr,
  })

  @Role("account")
  @Get()
  async getProjectsByProfileId(@Body() reqGetallAttr: ReqGetallAttr) {
    const { profileId, take, page } = reqGetallAttr;
    const projects = await this.projectService.getAll(page, take, { where: { profile: { id: profileId } } });
    return projects;
  }

  @ApiResponse({
    type: Project,
  })
  @ApiBody({
    type: ReqAddProject,
  })
  @Role("account")
  @Post()
  async addProject(@Body() reqAddProject: ReqAddProject, @CurrentAccount() account: Account) {
    const { name, repoLink, role, isParticipatingNow } = reqAddProject;
    const profile = await this.profileService.getOne({ account: { id: account.id } });
    const project = await this.projectService.create({ profile, name, repoLink, role, isParticipatingNow });
    return this.projectService.getOne({ id: project.id });
  }

  @ApiResponse({
    type: Project,
  })
  @ApiParam({
    name: "id",
    format: "UUID",
  })
  @Role("account")
  @Delete(":id")
  async deleteProject(@Param("id") id: string, @CurrentAccount() account: Account) {
    const control = isUUID(id);
    if (!control) throw new NotFoundException(generateException("PROJECT_NOT_FOUND"));
    const profile = await this.profileService.getOne({ account: { id: account.id } });
    const project = await this.projectService.getOne({ profile: { id: profile.id }, id });
    await this.projectService.remove({ id: project.id });
    return project;
  }
}
