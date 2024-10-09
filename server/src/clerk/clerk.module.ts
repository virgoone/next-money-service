import { Module } from '@nestjs/common'

import { ClerkController } from './controller/clerk.controller'
import { ClerkService } from './service/clerk.service'

@Module({
  providers: [ClerkService],
  exports: [ClerkService],
  controllers: [ClerkController],
})
export class ClerkModule {}
