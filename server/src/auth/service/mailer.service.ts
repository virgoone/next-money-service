import { Injectable, Logger } from '@nestjs/common'


@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name)

  async sendEmailCode(email: string, code: string) {
    try {
      await this.sendEmailCodeBySmtp(email, code.toString())
    } catch (error) {
      this.logger.error(error, error.response?.body)
      return error.message
    }
  }

  async sendEmailCodeBySmtp(email: string, code: string) {
    console.log('send mail-->', email, code)
  }
}
