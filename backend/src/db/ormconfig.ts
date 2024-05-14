import { Account } from "src/account/entities/account.entity";
import { EmailVerification } from "src/auth/entities/email-verification.entity";
import { Capability } from "src/profile/entities/capability.entity";
import { Education } from "src/profile/entities/education.entity";
import { Experience } from "src/profile/entities/experience.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { Project } from "src/profile/entities/project.entity";
import { Reference } from "src/profile/entities/reference.entity";
import { Review } from "src/profile/entities/review.entity";
import { DataSource, DataSourceOptions } from "typeorm";
require("dotenv").config();

export const dataSourceOption: DataSourceOptions =
{
  type: "postgres",
  database: process.env["DB_NAME"],
  username: process.env["DB_USERNAME"],
  password: process.env["DB_PASSWORD"],
  port: Number(process.env["DB_PORT"]),
  synchronize: process.env["DB_SYNCHRONIZE"] === "true" ? true : false,
  host: process.env["DB_HOST"],
  entities: [Account, EmailVerification, Capability, Education, Experience, Profile, Project, Reference, Review],
  migrations: ["./src/db/migrations"],
  migrationsTableName: "migrations",
}

export const dataSource = new DataSource(dataSourceOption);
