import { Module } from '@nestjs/common'

import { BucketModule } from '@/bucket/bucket.module'

import { BucketHealthIndicator } from './indicators/health.bucket.indicator'
import { DBHealthIndicator } from './indicators/health.db.indicator'

@Module({
  providers: [BucketHealthIndicator, DBHealthIndicator],
  exports: [BucketHealthIndicator, DBHealthIndicator],
  imports: [BucketModule],
})
export class HealthModule {}
