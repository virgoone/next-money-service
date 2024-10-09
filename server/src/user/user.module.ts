import { Module } from '@nestjs/common'

import { UserController } from './controller/user.controller'
import { UserService } from './service/user.service'

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
