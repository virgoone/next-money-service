import { Injectable } from '@nestjs/common'
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus'

import { BucketService } from '@/bucket/services/bucket.service'

@Injectable()
export class BucketHealthIndicator extends HealthIndicator {
  constructor(
    private readonly bucketService: BucketService,
  ) {
    super()
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.bucketService.listBucket()
      return this.getStatus(key, true)
    } catch (error) {
      throw new HealthCheckError(
        'BucketHealthIndicator failed',
        this.getStatus(key, false),
      )
    }
  }
}
