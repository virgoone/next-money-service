import { IRequest, IResponse } from '@/utils/request'
import { ApiResponseObject, ApiResponsePagination, ApiResponseString, ResponseUtil } from '@/utils/response'

import { Controller, Param, Get, Put, Post, Delete, Logger, Query, Body, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { AuthService } from '@/auth/service/auth.service'
import { JwtAuthGuard } from '@/auth/guard/jwt.auth.guard'
import { InjectUser } from '@/utils/decorator'
import { ClerkUserQuery } from "../interface/query.interface"
import { ClerkService } from '../service/clerk.service'
import { ClerkUserDto } from '../dto/get.dto'

@ApiTags('Clerk')
@ApiBearerAuth('Authorization')
@Controller('clerk')
export class ClerkController {
  constructor(
    private readonly service: ClerkService,
    private readonly authService: AuthService,
  ) { }

  /**
   * Get my billings
   */
  @ApiOperation({ summary: 'Get users' })
  @ApiResponsePagination(ClerkUserDto)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'sort',
    type: String,
    description: 'sort',
    required: false,
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
    name: 'userId',
    type: String,
    description: 'userId',
    required: false,
  })
  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const query: ClerkUserQuery = {
      page: page || 1,
      pageSize: pageSize || 10,
    }

    if (query.pageSize > 100) {
      query.pageSize = 100
    }

    if (userId) {
      query.userId = userId
    }

    const data = await this.service.findByPage(query)
    return ResponseUtil.ok(data)
  }
}