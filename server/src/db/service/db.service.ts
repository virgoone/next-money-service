import { Inject, Injectable } from '@nestjs/common'

import { PrismaClient } from '@prisma/client'

import { DB_CLIENT } from '../constants'

@Injectable()
export class DBService {
  constructor(@Inject(DB_CLIENT) private readonly dbClient: PrismaClient) {}

  getClient(): PrismaClient {
    return this.dbClient
  }

  get db() {
    return this.getClient()
  }
}
