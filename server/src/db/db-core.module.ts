import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
} from '@nestjs/common'

import { PrismaClient } from '@prisma/client'

import { DB_CLIENT, DB_MODULE_OPTIONS } from './constants'
import { createAsyncClientOptions, createClient } from './db.provider'
import { DBModuleAsyncOptions, DBModuleOptions } from './interface/db.interface'
import { DBService } from './service/db.service'

@Global()
@Module({
  providers: [DBService],
  exports: [DBService],
})
export class DBCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(DB_MODULE_OPTIONS)
    private readonly options: DBModuleOptions,
    @Inject(DB_CLIENT)
    private readonly dbClient: PrismaClient,
  ) {}

  static register(options: DBModuleOptions): DynamicModule {
    return {
      module: DBCoreModule,
      providers: [
        createClient(),
        { provide: DB_MODULE_OPTIONS, useValue: options },
      ],
      exports: [DBService],
    }
  }

  static forRootAsync(options: DBModuleAsyncOptions): DynamicModule {
    return {
      module: DBCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [DBService],
    }
  }

  onModuleDestroy() {
    const closeConnection = (client: PrismaClient) => async (options) => {
      if (client && !options.keepAlive) {
        await client.$disconnect()
      }
    }

    const closeClientConnection = closeConnection(this.dbClient)

    closeClientConnection(this.options)
  }
}
