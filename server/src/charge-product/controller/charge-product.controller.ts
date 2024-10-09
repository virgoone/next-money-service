import { IRequest, IResponse } from '@/utils/request'
import { ApiResponseObject, ApiResponsePagination, ApiResponseString, ResponseUtil } from '@/utils/response'

import { Controller, Param, Get, Put, Post, Delete, Logger, Query, Body, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { FileInterceptor } from '@nestjs/platform-express'

import { AuthService } from '@/auth/service/auth.service'
import { JwtAuthGuard } from '@/auth/guard/jwt.auth.guard'
import { ChargeProductService } from '../service/charge-product.service'
import { InjectUser } from '@/utils/decorator'
import { ChargeProductDto } from '../dto/get.dto'
import { ChargeProductQuery } from '../interface/query.interface'
import { ChargeProductCreateDto } from '../dto/create.dto'
import { ChargeProductHashids } from '@/db/dto/charge-product.dto'
import { ChargeProductUpdateDto } from '../dto/update.dto'
import { number } from 'zod'

@ApiTags('Charge Product')
@ApiBearerAuth('Authorization')
@Controller('charge-product')
export class ChargeProductController {
  constructor(
    private readonly service: ChargeProductService,
    private readonly authService: AuthService,
  ) { }

  /**
   * Get my billings
   */
  @ApiOperation({ summary: 'Get charge products' })
  @ApiResponsePagination(ChargeProductDto)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'sort',
    type: String,
    description: 'sort',
    required: false,
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'id',
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
    name: 'state',
    type: String,
    description: 'charge product state',
    required: false,
  })
  @ApiQuery({
    name: 'operator',
    type: String,
    description: 'operator',
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
    const query: ChargeProductQuery = {
      page: page || 1,
      pageSize: pageSize || 10,
    }

    if (query.pageSize > 100) {
      query.pageSize = 100
    }

    if (sort) {
      query.sort = sort
    }

    if (state) {
      query.state = state
    }

    if (startTime) {
      query.from = startTime
    }

    if (endTime) {
      query.to = endTime
    }

    if (id) {
      const [numId] = ChargeProductHashids.decode(id)
      query.id = Number(numId)
    }

    const data = await this.service.findByPage(query)
    return ResponseUtil.ok(data)
  }

  @ApiOperation({ summary: 'Create charge product' })
  @ApiResponseObject(ChargeProductDto)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: ChargeProductCreateDto) {
    const data = await this.service.create(body)
    return ResponseUtil.ok({
      ...data,
      id: ChargeProductHashids.encode(data.id),
    })
  }

  @ApiOperation({ summary: 'Update charge product' })
  @ApiResponseObject(ChargeProductDto)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: ChargeProductUpdateDto) {
    const [chargeProductId] = ChargeProductHashids.decode(id)
    const data = await this.service.update(chargeProductId as number, body)

    return ResponseUtil.ok({
      ...data,
      id: ChargeProductHashids.encode(data.id),
    })
  }

  @ApiOperation({ summary: 'Delete charge product' })
  @ApiResponseString()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const [chargeProductId] = ChargeProductHashids.decode(id)
    await this.service.delete(chargeProductId as number)
    return ResponseUtil.ok('success')
  }
}