
import { Body, Controller, Logger, Post, Req } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'


import { ApiResponseString, ResponseUtil } from '@/utils/response'
import { GetClientIPFromRequest, IRequest } from '@/utils/request'
import { UserService } from '@/user/service/user.service'
import { EmailSigninDto } from '../dto/email.signin.dto'
import { SendEmailCodeDto } from '../dto/send-email-code.dto'
import { AuthService } from '../service/auth.service'
import { VerifyCodeType } from '../type'
import { UserHashids } from '@/db/dto/user.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }
  /**
     * send email code
     */
  @ApiOperation({ summary: 'Send email verify code' })
  @ApiResponse({ type: ResponseUtil })
  @ApiBody({ type: SendEmailCodeDto })
  @Post('email/code')
  async sendCode(@Req() req: IRequest, @Body() dto: SendEmailCodeDto) {
    const { email, type } = dto
    const ip = GetClientIPFromRequest(req)

    if (type !== VerifyCodeType.Signup) {
      const user = await this.userService.findOneByEmail(email)
      if (!user) {
        return ResponseUtil.error('用户不存在')
      }
    }

    const err = await this.authService.sendCode(email, type, ip)
    if (err) {
      return ResponseUtil.error(err)
    }
    return ResponseUtil.ok('success')
  }

  /**
   * Signin by phone and verify code
   */
  @ApiOperation({ summary: 'Signin by email and verify code' })
  @ApiResponse({ type: ResponseUtil })
  @Post('email/signin')
  async signin(@Body() dto: EmailSigninDto) {
    const { email, code } = dto
    // check if code valid
    const err = await this.authService.validateCode(
      email,
      code,
      VerifyCodeType.Signin,
    )
    if (err) return ResponseUtil.error(err)

    // check if user exists
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      return ResponseUtil.error('用户不存在')
      // const { username, password } = dto
      // if (!username || !password) {
      //   return ResponseUtil.error('username and password is required')
      // }
      // const newUser = await this.userService.signup({ name: username, password, email })
      // const data = this.authService.signin(newUser)
      // return ResponseUtil.ok(data)
    }
    const userId = UserHashids.encode(user.id)
    const token = this.authService.signin(userId)
    return ResponseUtil.ok(token)
  }
}
