import { IRequest, IResponse } from '@/utils/request'
import { ApiResponseObject, ApiResponsePagination, ApiResponseString, ResponseUtil } from '@/utils/response'
import { Controller, Param, Get, Put, Post, Delete, Logger, Query, Body, UseGuards, UseInterceptors, UploadedFile, Req, Res } from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger'
import { omit } from 'lodash'
import { UserOmitProps } from '@/app/constants/app.constant'
import { AuthService } from '@/auth/service/auth.service'
import { VerifyCodeType } from '@/auth/type'
import { JwtAuthGuard } from '@/auth/guard/jwt.auth.guard'
import { BindEmailDto } from '../dto/bind-email.dto'
import { BindUsernameDto } from '../dto/bind-username.dto'
import { UpdateAvatarDto } from '../dto/update-avatar.dto'
import { UserService } from '../service/user.service'
import { UserHashids } from '@/db/dto/user.dto'
import { UserWithProfile, UserWithSts } from '@/auth/dto/user.get.dto'
import { BucketService } from '@/bucket/services/bucket.service'
import { ResetPasswordDto, BindPasswordDto } from '../dto/bind-password.dto'
import { UserDto } from '../dto/get.dto'
import { UserQuery } from '../interface/query.interface'
import { CreateUserDto } from '../dto/create-user.dto'

@ApiTags('User')
@ApiBearerAuth('Authorization')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly bucketService: BucketService,
  ) { }


  /**
   * Get my billings
   */
  @ApiOperation({ summary: 'Get admin users' })
  @ApiResponsePagination(UserDto)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'sort',
    type: String,
    description: 'sort',
    required: false,
  })
  @ApiQuery({
    name: 'state',
    type: String,
    description: 'user state',
    required: false,
  })
  @ApiQuery({
    name: 'startTime',
    type: String,
    description: 'pagination start time',
    required: false,
    example: '2021-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endTime',
    type: String,
    description: 'pagination end time',
    required: false,
    example: '2022-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    description: 'page size',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'operator',
    type: String,
    description: 'operator',
    required: false,
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'id',
    required: false,
  })
  @Get()
  async findAll(
    @Query('id') id?: string,
    @Query('sort') sort?: string,
    @Query('state') state?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const query: UserQuery = {
      page: page || 1,
      pageSize: pageSize || 10,
    }

    if (query.pageSize > 100) {
      query.pageSize = 100
    }

    if (state) {
      query.state = state
    }

    if (sort) {
      query.sort = sort
    }

    if (id) {
      const [numId] = UserHashids.decode(id)
      query.id = Number(numId)
    }

    if (startTime) {
      query.from = startTime
    }

    if (endTime) {
      query.to = endTime
    }

    const data = await this.userService.findByPage(query)
    return ResponseUtil.ok(data)
  }


  /**
   * Update avatar of user
   * @param dto
   * @returns
   */
  @ApiResponseObject(UserWithProfile)
  @ApiOperation({ summary: 'Update avatar of user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateAvatarDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 2 * 1024 * 1024, // 2M
      },
    }),
  )
  async updateAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: IRequest,
  ) {
    if (!avatar) {
      return ResponseUtil.error('avatar is required')
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(avatar.mimetype)) {
      return ResponseUtil.error('avatar only supports jpeg/png/gif')
    }

    const user = req.user
    const res = await this.userService.updateAvatar(avatar, user.id)

    return ResponseUtil.ok(omit({ ...res, id: UserHashids.encode(res.id) }, UserOmitProps))
  }

  /**
   * Get avatar of user
   * @param dto
   * @returns
   */
  @ApiOperation({ summary: 'Get avatar of user' })
  @Get('avatar/:uid')
  async getAvatar(@Param('uid') uid: string, @Res() res: IResponse) {
    const [id] = UserHashids.decode(uid)
    const user = await this.userService.findOneById(id as number)

    if (user.avatar?.startsWith('http')) {
      res.redirect(user.avatar)
      return
    }

    res.redirect(`https://i.pravatar.cc/150?img=${uid}`)
  }

  @ApiOperation({ summary: 'Create admin user' })
  @ApiResponseString()
  @Post('create/user')
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() dto: CreateUserDto) {
    const _user = await this.userService.findOneByEmail(dto.email)
    if (_user) {
      return ResponseUtil.error('email has already been bound')
    }
    const userId = await this.userService.signup(dto)
    return ResponseUtil.ok(userId)
  }

  /**
   * Bind email
   */
  @ApiOperation({ summary: 'Bind email' })
  @ApiResponseObject(UserWithProfile)
  @UseGuards(JwtAuthGuard)
  @Post('bind/email')
  async bindEmail(@Body() dto: BindEmailDto, @Req() req: IRequest) {
    const { email, code, password } = dto
    const currentUser = req.user
    const err = await this.authService.validateCode(
      email,
      code,
      VerifyCodeType.Bind,
    )
    if (err) {
      return ResponseUtil.error(err)
    }

    // check email if have already been bound
    const user = await this.userService.findOneByEmail(email)
    if (user) {
      return ResponseUtil.error('email has already been bound')
    }

    // check password
    const isMatch = await this.userService.comparePassword(password, currentUser.hashedPassword)
    if (!isMatch) {
      return ResponseUtil.error('旧密码错误')
    }

    // bind email
    const res = await this.userService.updateUser(req.user.id, {
      email,
    })
    return ResponseUtil.ok(omit({ ...res, id: UserHashids.encode(res.id) }, UserOmitProps))
  }

  @ApiOperation({ summary: 'Reset password by code' })
  @Post('reset/password')
  @ApiResponseString()
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: IRequest) {
    const { code, email, password } = dto
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      return ResponseUtil.error('用户不存在')
    }
    const err = await this.authService.validateCode(
      email,
      code,
      VerifyCodeType.ResetPassword,
    )
    if (err) {
      return ResponseUtil.error(err)
    }
    const res = await this.userService.updateUser(user.id, {
      password,
    })
    return ResponseUtil.ok(UserHashids.encode(res.id))
  }

  @ApiOperation({ summary: 'Bind password' })
  @ApiResponseObject(UserWithProfile)
  @UseGuards(JwtAuthGuard)
  @Post('bind/password')
  async bindPassword(@Body() dto: BindPasswordDto, @Req() req: IRequest) {
    const { password, confirmPassword, oldPassword } = dto
    if (password !== confirmPassword) {
      return ResponseUtil.error('password and confirm password do not match')
    }
    const user = await this.userService.findOneById(req.user.id)
    if (!user) {
      return ResponseUtil.error('用户不存在')
    }
    const isMatch = await this.userService.comparePassword(oldPassword, user.hashedPassword)
    if (!isMatch) {
      return ResponseUtil.error('旧密码错误')
    }
    const res = await this.userService.updateUser(req.user.id, {
      password,
    })
    return ResponseUtil.ok(omit({ ...res, id: UserHashids.encode(res.id) }, UserOmitProps))
  }

  /**
   * Bind username
   */
  @ApiOperation({ summary: 'Bind username' })
  @ApiResponseObject(UserWithProfile)
  @UseGuards(JwtAuthGuard)
  @Post('bind/username')
  async bindUsername(@Body() dto: BindUsernameDto, @Req() req: IRequest) {
    const { username } = dto
    // // check code valid
    // const err = await this.smsService.validateCode(
    //   phone,
    //   code,
    //   VerifyCodeType.Bind,
    // )
    // if (err) {
    //   return ResponseUtil.error(err)
    // }

    // check username if have already been bound
    if (username === req.user.username) {
      return ResponseUtil.ok(req.user._id)
    }
    const user = await this.userService.findOneByUsername(username)
    if (user) {
      return ResponseUtil.error('username already been bound')
    }

    // bind username
    const res = await this.userService.updateUser(req.user.id, { name: username })
    return ResponseUtil.ok(omit({ ...res, id: UserHashids.encode(res.id) }, UserOmitProps))
  }

  /**
   * Get current user profile
   * @param request
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponseObject(UserWithProfile)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('Authorization')
  async getProfile(@Req() request: IRequest) {
    const user = request.user
    return ResponseUtil.ok(omit({ ...user, id: UserHashids.encode(user.id) }, UserOmitProps))
  }

  @ApiOperation({ summary: 'Get user upload sts' })
  @ApiResponseObject(UserWithSts)
  @UseGuards(JwtAuthGuard)
  @Post('/sts/:key')
  async getSts(@Req() request: IRequest, @Param('key') key: string) {
    const user = request.user
    const prefix = '/user/' + user.id + '/'
    const res = await this.bucketService.getSts(key, prefix)
    return ResponseUtil.ok(res)
  }
}
