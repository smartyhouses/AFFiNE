import { Module } from '@nestjs/common';

import { DocModule } from '../doc';
import { PermissionModule } from '../permission';
import { DocRendererController } from './controller';

@Module({
  imports: [DocModule, PermissionModule],
  controllers: [DocRendererController],
})
export class DocRendererModule {}
