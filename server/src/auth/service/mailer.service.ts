import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { VerifyIdentityEmail } from '@/emails/verify-identity'
import { VerifyCodeType, VerifyCodeTypeMap } from '../type'

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name)
  private readonly resend: Resend
  private readonly emailFrom: string
  private readonly isDev: boolean

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get('auth.resend.apiKey'))
    this.emailFrom = this.configService.get('auth.resend.emailFrom')
    this.isDev = this.configService.get('app.isDev')
  }

  async sendEmailCode(email: string, code: string, type?: VerifyCodeType) {
    try {
      await this.sendEmailCodeBySmtp(email, code.toString(), type)
    } catch (error) {
      this.logger.error(error, error.response?.body)
      return error.message
    }
  }

  async sendEmailCodeBySmtp(email: string, code: string, type?: VerifyCodeType) {
    if (this.isDev) {
      console.log('send mail-->', email, code)
      return
    }
    const title = type ? VerifyCodeTypeMap[type] : '账户验证'
    await this.resend.emails.send({
      from: this.emailFrom,
      to: email,
      subject: `${title} - 来自 FluxAI 账户中心`,
      react: VerifyIdentityEmail({ validationCode: code, title }),
    })
  }
}
