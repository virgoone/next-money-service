import { Module } from '@nestjs/common'

import { GiftCodeController } from './controller/giftcode.controller'
import { GiftCodeService } from './service/giftcode.service'
import { ChargeOrderController } from './controller/charge-order.controller'
import { ChargeOrderService } from './service/charge-order.service'
import { ClerkModule } from '@/clerk/clerk.module'

@Module({
  imports: [ClerkModule],
  providers: [GiftCodeService, ChargeOrderService],
  exports: [GiftCodeService, ChargeOrderService],
  controllers: [GiftCodeController, ChargeOrderController],
})
export class OrderModule { }
