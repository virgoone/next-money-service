import { IRequest, IResponse } from '@/utils/request'
import { ApiResponseObject, ApiResponsePagination, ApiResponseString, ResponseUtil } from '@/utils/response'

import { Controller, Param, Get, Put, Post, Delete, Logger, Query, Body, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { FileInterceptor } from '@nestjs/platform-express'

import { AuthService } from '@/auth/service/auth.service'
import { JwtAuthGuard } from '@/auth/guard/jwt.auth.guard'
import { GiftCodeService } from '../service/giftcode.service'
import { InjectUser } from '@/utils/decorator'
import { GiftCodeDto } from '../dto/get.dto'
import { GiftCodeQuery } from "../interface/query.interface"
import { GiftCodeCreateDto } from '../dto/create.dto'
import { GiftCodeHashids } from '@/db/dto/giftcode.dto'
import { GiftCodeUpdateDto } from '../dto/update.dto'

@ApiTags('Order')
@ApiBearerAuth('Authorization')
@Controller('gift-code')
export class GiftCodeController {
  constructor(
    private readonly service: GiftCodeService,
    private readonly authService: AuthService,
  ) { }

  /**
   * Get my billings
   */
  @ApiOperation({ summary: 'Get gift codes' })
  @ApiResponsePagination(GiftCodeDto)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'sort',
    type: String,
    description: 'sort',
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
    @Query('code') code?: string,
    @Query('sort') sort?: string,
    @Query('state') state?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const query: GiftCodeQuery = {
      page: page || 1,
      pageSize: pageSize || 10,
    }

    if (query.pageSize > 100) {
      query.pageSize = 100
    }

    if (state) {
      query.state = state
    }

    if (code) {
      query.code = code
    }

    if (sort) {
      query.sort = sort
    }

    if (id) {
      const [numId] = GiftCodeHashids.decode(id)
      query.id = Number(numId)
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

  @ApiOperation({ summary: 'Create gift code' })
  @ApiResponseObject(GiftCodeDto)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: GiftCodeCreateDto) {
    try {
      const data = await this.service.create(body)
      return ResponseUtil.ok({
        ...data,
        id: GiftCodeHashids.encode(data.id),
      })
    } catch (error) {
      return ResponseUtil.error(error.message)
    }
  }

  @ApiOperation({ summary: 'Update gift code' })
  @ApiResponseObject(GiftCodeDto)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: GiftCodeUpdateDto) {
    try {
      const [giftCodeId] = GiftCodeHashids.decode(id)
      const data = await this.service.update(giftCodeId as number, body)

      return ResponseUtil.ok({
        ...data,
        id: GiftCodeHashids.encode(data.id),
      })
    } catch (error) {
      return ResponseUtil.error(error.message)
    }
  }

  @ApiOperation({ summary: 'Delete gift code' })
  @ApiResponseString()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const [giftCodeId] = GiftCodeHashids.decode(id)
    await this.service.delete(giftCodeId as number)
    return ResponseUtil.ok('success')
  }
}