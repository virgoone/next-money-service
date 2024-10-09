import { Global, Module } from '@nestjs/common'

import { BucketService } from './services/bucket.service'

@Global()
@Module({
  providers: [BucketService],
  controllers: [],
  exports: [BucketService],
})
export class BucketModule {}
