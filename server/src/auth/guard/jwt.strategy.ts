import { ExtractJwt, Strategy } from 'passport-jwt'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { UserService } from '@/user/service/user.service'
import { UserHashids } from '@/db/dto/user.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const secretKey = configService.get('auth.accessToken.secretKey')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    })
  }

  /**
   * Turn payload to user object
   * @param payload
   * @returns
   */
  async validate(payload: any) {
    const [id] = UserHashids.decode(payload.sub)
    const user = await this.userService.findOneById(id as number)
    return user
  }
}
