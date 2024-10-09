import { isEmail } from 'class-validator'

import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma, PrismaClient } from '@prisma/client'
import { DBService } from '@/db/service/db.service'
import { JwtService } from '@nestjs/jwt'

import {
  CODE_VALIDITY,
  LIMIT_CODE_PER_IP_PER_DAY,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_MINUTE,
  TASK_LOCK_INIT_TIME,
} from '@/app/constants/app.constant'
import { UserService } from '@/user/service/user.service'
import { HashUtil } from '@/utils/hash'

import { VerifyCodeType, VerifyCodeState } from '../type'
import { MailerService } from './mailer.service'

@Injectable()
export class AuthService {
  private readonly passwordSaltLength: number
  private readonly isDev: boolean
  private readonly db: PrismaClient

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(DBService) private readonly dbService: DBService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {
    this.db = this.dbService.db

    this.passwordSaltLength = this.configService.get<number>(
      'auth.password.saltLength',
    )
    this.isDev = this.configService.get<boolean>('app.isDev')
  }

  /**
   * Get access token by user
   * @param user
   * @returns
   */
  getAccessTokenByUser(userid: string): string {
    const payload = { sub: userid }
    const token = this.jwtService.sign(payload)
    return token
  }

  async sendCode(email: string, type: VerifyCodeType, ip: string) {
    let err = await this.checkSendable(email, ip)
    if (err) return err

    const code = this.isDev
      ? '111111'
      : Math.floor(Math.random() * 900000 + 100000).toString()
    err = await this.mailerService.sendEmailCode(email, code)
    if (err) return err

    await this.disableSameTypeCode(email, type)

    await this.saveCode(email, code, type, ip)
  }

  async saveCode(
    email: string,
    code: string,
    type: VerifyCodeType,
    ip: string,
  ) {
    await this.db.verifyCode.create({
      data: {
        email,
        code,
        type,
        ip,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: VerifyCodeState.Unused,
      }
    })
  }

  // Valid given email and code with code type
  async validateCode(email: string, code: string, type: VerifyCodeType) {
    const total = await this.db
      .verifyCode.count({
        where: {
          email,
          code,
          type,
          state: VerifyCodeState.Unused,
          createdAt: { gt: new Date(Date.now() - CODE_VALIDITY) },
        }
      })

    if (total === 0) return 'invalid code'

    // Disable verify code after valid
    await this.disableCode(email, code, type)
    return null
  }

  // Disable verify code
  async disableCode(email: string, code: string, type: VerifyCodeType) {
    const verifyCode = await this.db.verifyCode.findFirst({
      where: { email, code, type, state: VerifyCodeState.Unused },
    })
    if (!verifyCode) return
    await this.db
      .verifyCode.update({
        where: { id: verifyCode.id },
        data: { state: VerifyCodeState.Used },
      })
  }

  // Disable same type verify code
  async disableSameTypeCode(email: string, type: VerifyCodeType) {
    await this.db
      .verifyCode.updateMany({
        where: { email, type, state: VerifyCodeState.Unused },
        data: { state: VerifyCodeState.Used },
      })
  }

  // check if email satisfy the send condition
  async checkSendable(email: string, ip: string) {
    // Check if email is valid
    if (!isEmail(email)) {
      return 'INVALID_EMAIL'
    }

    // Check if email has been the sent verify code in 1 minute
    const count = await this.db.verifyCode.count({
      where: {
        email,
        createdAt: { gt: new Date(Date.now() - MILLISECONDS_PER_MINUTE) },
      }
    })

    if (count > 0) {
      return 'REQUEST_OVERLIMIT: email has been sent the verify code in 1 minute'
    }

    // Check if ip has been send email code beyond 30 times in 24 hours
    const countIps = await this.db.verifyCode.count({
      where: {
        ip: ip,
        createdAt: { gt: new Date(Date.now() - MILLISECONDS_PER_DAY) },
      }
    })

    if (countIps > LIMIT_CODE_PER_IP_PER_DAY) {
      return `REQUEST_OVERLIMIT: ip has been send email code beyond ${LIMIT_CODE_PER_IP_PER_DAY} times in 24 hours`
    }

    return null
  }

  /**
   * signin a user, return token and if bind password
   * @param user user
   * @returns token and if bind password
   */
  signin(userid: string) {
    const token = this.getAccessTokenByUser(userid)
    return token
  }
}
