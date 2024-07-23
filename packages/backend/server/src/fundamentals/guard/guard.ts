import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { GUARD_PROVIDER } from './provider';

const BasicGuardSymbol = Symbol('BasicGuard');

@Injectable()
export class BasicGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    // api is public
    const providerName = this.reflector.get<string>(
      BasicGuardSymbol,
      context.getHandler()
    );

    const provider = GUARD_PROVIDER[providerName];
    if (provider) {
      return await provider.canActivate(context);
    }

    return true;
  }
}

/**
 * This guard is used to protect routes/queries/mutations that use a registered guard
 *
 * add `@UseBasicGuard()` to register the guard for a route/query/mutation,
 * then add `@Guard('guard-name')` to specify the guard to use
 *
 * @example
 *
 * ```typescript
 * \@UseBasicGuard('captcha') // use captcha guard
 * \@Auth()
 * \@Query(() => UserType)
 * user(@CurrentUser() user: CurrentUser) {
 *   return user;
 * }
 * ```
 */
export const UseBasicGuard = (name: string): MethodDecorator => {
  return (target: any, key: string | symbol, descriptor?: any) => {
    UseGuards(BasicGuard)(target, key, descriptor);
    SetMetadata(BasicGuardSymbol, name)(target, key, descriptor);
  };
};
