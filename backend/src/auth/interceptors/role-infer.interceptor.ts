import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { AccountRole } from "../models/role.model";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const role: AccountRole = request?.account
      ? request?.account?.isAdmin
        ? "admin"
        : "account"
      : "public";
    return next.handle().pipe(
      map((data) =>
        instanceToPlain(data, {
          enableImplicitConversion: true,
          groups: [role],
        }),
      ),
    );
  }
}
