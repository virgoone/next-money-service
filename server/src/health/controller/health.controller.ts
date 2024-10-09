import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus'

// import { DatabaseConnection } from '@/database/decorators/database.decorator'
import { HealthSerialization } from '@/health/serializations/health.serialization'
import { ApiResponseObject, ResponseUtil } from '@/utils/response'
import { BucketHealthIndicator } from '@/health/indicators/health.bucket.indicator'
import { DBHealthIndicator } from '@/health/indicators/health.db.indicator'

@ApiTags('健康检查')
@Controller({
  version: VERSION_NEUTRAL,
  path: '/health',
})
@ApiBearerAuth('Authorization')
export class HealthPublicController {
  constructor(
    private readonly dbIndicator: DBHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly awsS3Indicator: BucketHealthIndicator,
  ) { }

  @ApiOperation({ summary: 'Get bucket status' })
  @ApiResponseObject(HealthSerialization)
  @HealthCheck()
  @Get('/bucket')
  async checkAws() {
    const data = await this.health.check([
      () => this.awsS3Indicator.isHealthy('bucket'),
    ])

    return ResponseUtil.ok(data)
  }

  @ApiOperation({ summary: 'Get database status' })
  @ApiResponseObject(HealthSerialization)
  @HealthCheck()
  @Get('/database')
  async checkDatabase() {
    const data = await this.health.check([
      () => this.dbIndicator.isHealthy('database'),
    ])

    return ResponseUtil.ok(data)
  }

  @ApiOperation({ summary: 'Get memory heap status' })
  @ApiResponseObject(HealthSerialization)
  @HealthCheck()
  @Get('/memory-heap')
  async checkMemoryHeap() {
    const data = await this.health.check([
      () =>
        this.memoryHealthIndicator.checkHeap('memoryHeap', 300 * 1024 * 1024),
    ])

    return ResponseUtil.ok(data)
  }

  @ApiOperation({ summary: 'Get memory rss status' })
  @ApiResponseObject(HealthSerialization)
  @HealthCheck()
  @Get('/memory-rss')
  async checkMemoryRss() {
    const data = await this.health.check([
      () => this.memoryHealthIndicator.checkRSS('memoryRss', 300 * 1024 * 1024),
    ])

    return ResponseUtil.ok(data)
  }
}
