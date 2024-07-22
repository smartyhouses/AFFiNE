import type {
  CanActivate,
  ExecutionContext,
  OnModuleInit,
} from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import {
  getRequestResponseFromContext,
  GuardProvider,
} from '../../fundamentals';
import { CaptchaService } from './service';

@Injectable()
export class CaptchaGuardProvider
  extends GuardProvider
  implements CanActivate, OnModuleInit
{
  private readonly logger = new Logger(CaptchaGuardProvider.name);
  private captcha?: CaptchaService;

  constructor(private readonly ref: ModuleRef) {
    super();
  }

  override onModuleInit() {
    super.onModuleInit();
    try {
      this.captcha = this.ref.get(CaptchaService, { strict: false });
      this.logger.log('Captcha guard is enabled');
    } catch {
      // ignore
    }
  }

  override get name() {
    return 'captcha';
  }

  async canActivate(context: ExecutionContext) {
    const { req } = getRequestResponseFromContext(context);

    const captcha = this.captcha;
    if (captcha) {
      const { token, challenge } = req.query;
      const credential = captcha.assertValidCredential({ token, challenge });
      await captcha.verifyRequest(credential, req);
    }

    return true;
  }
}
