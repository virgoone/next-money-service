import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '@/user/user.module'

import { AuthController } from './controller/auth.controller'
import { MailerService } from './service/mailer.service'
import { JwtStrategy } from './guard/jwt.strategy'
import { AuthService } from './service/auth.service'

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secretKey = configService.get('auth.accessToken.secretKey')
        const expirationTime = configService.get(
          'auth.accessToken.expirationTime',
        )
        return {
          secret: secretKey,
          signOptions: { expiresIn: expirationTime },
        }
      },
    }),
    UserModule,
    HttpModule,
  ],
  providers: [
    JwtStrategy,
    AuthService,
    MailerService,
  ],
  exports: [
    AuthService,
    MailerService,
  ],
  controllers: [
    AuthController,
  ],
})
export class AuthModule { }
