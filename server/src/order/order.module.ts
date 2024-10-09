import { Module } from '@nestjs/common'

import { GiftCodeController } from './controller/giftcode.controller'
import { GiftCodeService } from './service/giftcode.service'

@Module({
  providers: [GiftCodeService],
  exports: [GiftCodeService],
  controllers: [GiftCodeController],
})
export class OrderModule { }
