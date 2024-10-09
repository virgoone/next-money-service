import { Inject, Injectable } from '@nestjs/common'
import { DBService } from '@/db/service/db.service'
import { createClerkClient, type ClerkClient } from '@clerk/backend'
import { ConfigService } from '@nestjs/config'

import {
  BucketService,
} from '@/bucket/services/bucket.service'

@Injectable()
export class ClerkService {
  private readonly clerkClient: ClerkClient
  constructor(
    @Inject(BucketService)
    private readonly bucketService: BucketService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    const clerkSecretKey = this.configService.get('auth.clerkAuth.secretKey')
    this.clerkClient = createClerkClient({
      secretKey: clerkSecretKey,
    })
  }

  async findByPage(params: {
    page: number
    pageSize: number
    sort?: string
    from?: string
    userId?: string
    to?: string
  }) {
    const { userId, page = 1, pageSize = 10, sort, from, to } = params
    const offset = (page - 1) * pageSize;

    const { data, totalCount } = await this.clerkClient.users.getUserList({
      offset,
      limit: pageSize,
      userId: userId ? [userId] : undefined,
      orderBy: '-created_at',
    })
    const pageCount = Math.ceil(totalCount / pageSize);
    return {
      list: data,
      pageCount,
      page,
      pageSize,
      total: totalCount,
    };
  }

  async getUser(userId: string) {
    return await this.clerkClient.users.getUser(userId)
  }

  async updateUser(userId: string, data: { name?: string, email?: string, avatar?: string, phone?: string }) {
    return await this.clerkClient.users.updateUser(userId, data)
  }

}
