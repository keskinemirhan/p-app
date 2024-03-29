import { UseGuards, UseInterceptors, applyDecorators } from "@nestjs/common";
import { AdminAccountGuard } from "../guards/admin-account.guard";
import { RegularAccountGuard } from "../guards/regular-account.guard";
import { RoleInterceptor } from "../interceptors/role-infer.interceptor";
import { AccountRole } from "../models/role.model";



export function Role(role: AccountRole) {
  if (role === 'admin') {
    return applyDecorators(
      UseGuards(AdminAccountGuard),
      UseInterceptors(RoleInterceptor)
    )
  } else if (role === 'account') {
    return applyDecorators(
      UseGuards(RegularAccountGuard),
      UseInterceptors(RoleInterceptor),

    )
  } else {
    return applyDecorators(
      UseInterceptors(RoleInterceptor)

    )
  }

}
