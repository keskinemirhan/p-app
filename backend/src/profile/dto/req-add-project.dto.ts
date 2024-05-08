import { IsBoolean, IsString, IsUrl } from "class-validator";

export class ReqAddProject {
  @IsString()
  name: string;

  @IsUrl()
  repoLink: string;

  @IsString()
  role: string;

  @IsBoolean()
  isParticipatingNow: boolean;
}
