import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ReqRegisterDto {
  @ApiProperty()
  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}
