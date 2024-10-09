import { IRequest, IResponse } from '@/utils/request'
import { ApiResponseObject, ApiResponsePagination, ApiResponseString, ResponseUtil } from '@/utils/response'

import { Controller, Param, Get, Put, Post, Delete, Logger, Query, Body, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { AuthService } from '@/auth/service/auth.service'
import { JwtAuthGuard } from '@/auth/guard/jwt.auth.guard'
import { ChargeOrderService } from '../service/charge-order.service'
import { InjectUser } from '@/utils/decorator'
import { ChargeOrderDto } from '../dto/get.dto'
import { ChargeOrderQuery } from "../interface/query.interface"
import { ChargeOrderHashids } from '@/db/dto/charge-order.dto'
import { ClerkService } from '@/clerk/service/clerk.service'

@ApiTags('Order')
@ApiBearerAuth('Authorization')
@Controller('charge-order')
export class ChargeOrderController {
  constructor(
    private readonly service: ChargeOrderService,
    private readonly authService: AuthService,
    private readonly clerkService: ClerkService,
  ) { }

  /**
   * Get my billings
   */
  @ApiOperation({ summary: 'Get charge orders' })
  @ApiResponsePagination(ChargeOrderDto)
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
    description: 'charge order phase state',
    required: false,
  })
  @ApiQuery({
    name: 'channel',
    type: String,
    description: 'charge order channel',
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
  @ApiQuery({
    name: 'userId',
    type: String,
    description: 'user id',
    required: false,
  })
  @Get()
  async findAll(
    @Query('id') id?: string,
    @Query('sort') sort?: string,
    @Query('userId') userId?: string,
    @Query('state') state?: string,
    @Query('channel') channel?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const query: ChargeOrderQuery = {
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

    if (userId) {
      query.userId = userId
    }

    if (id) {
      const [numId] = ChargeOrderHashids.decode(id)
      query.id = Number(numId)
    }

    if (channel) {
      query.channel = channel
    }

    if (startTime) {
      query.from = startTime
    }

    if (endTime) {
      query.to = endTime
    }

    const data = await this.service.findByPage(query)
    return ResponseUtil.ok(data)
  }

  @Get(':id')
  @ApiResponseObject(ChargeOrderDto)
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    const [numId] = ChargeOrderHashids.decode(id)
    const order = await this.service.findById(Number(numId))
    if (!order) {
      return ResponseUtil.error('Order not found')
    }
    const user = await this.clerkService.getUser(order.userId)
    return ResponseUtil.ok({
      ...order,
      user,
      id: ChargeOrderHashids.encode(order.id),
    })
  }

}