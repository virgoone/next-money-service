import { Module } from '@nestjs/common'

import { ChargeProductController } from './controller/charge-product.controller'
import { ChargeProductService } from './service/charge-product.service'

@Module({
  providers: [ChargeProductService],
  exports: [ChargeProductService],
  controllers: [ChargeProductController],
})
export class ChargeProductModule { }
