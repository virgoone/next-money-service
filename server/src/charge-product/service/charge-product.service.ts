import { Inject, Injectable } from '@nestjs/common'
import { DBService } from '@/db/service/db.service'
import { Prisma, PrismaClient } from '@prisma/client'

import {
  BucketService,
} from '@/bucket/services/bucket.service'
import { ChargeProductDto } from '../dto/get.dto'
import { ChargeProductHashids } from '@/db/dto/charge-product.dto'

@Injectable()
export class ChargeProductService {
  private readonly db: PrismaClient

  constructor(
    @Inject(BucketService)
    private readonly bucketService: BucketService,
    @Inject(DBService) private readonly dbService: DBService,
  ) {
    this.db = this.dbService.db
  }

  async create(params: Prisma.ChargeProductCreateInput) {
    return this.db.chargeProduct.create({
      data: params,
    })
  }

  async update(id: number, params: Prisma.ChargeProductUpdateInput) {
    return this.db.chargeProduct.update({
      where: {
        id,
      },
      data: params,
    })
  }

  async delete(id: number) {
    return this.db.chargeProduct.delete({
      where: {
        id,
      },
    })
  }

  async findById(id: number) {
    return this.db.chargeProduct.findUnique({
      where: {
        id,
      },
    })
  }

  async findByPage(params: {
    page: number
    pageSize: number
    id?: number
    sort?: string
    state?: string
    from?: string
    to?: string
    operator?: 'or' | 'and'
  }) {
    const { id, page = 1, pageSize = 10, sort, state, from, to, operator = 'and' } = params
    const offset = (page - 1) * pageSize;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ChargeProductDto | undefined, "asc" | "desc" | undefined];

    const whereConditions: Prisma.ChargeProductWhereInput = {};

    if (state) {
      whereConditions.state = state;
    }

    if (id) {
      whereConditions.id = {
        in: [id]
      }
    }

    if (from && to) {
      whereConditions.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const where =
      operator === "or"
        ? {
          OR: Object.entries(whereConditions).map(([key, value]) => ({
            [key]: value,
          })),
        }
        : whereConditions;

    const [data, total] = await Promise.all([
      this.db.chargeProduct.findMany({
        where,
        take: pageSize,
        skip: offset,
        orderBy: column ? { [column]: order ?? "desc" } : { id: "desc" },
      }),
      this.db.chargeProduct.count({ where }),
    ]);

    const pageCount = Math.ceil(total / pageSize);

    return {
      list: data.map(({ id, ...rest }) => ({
        ...rest,
        id: ChargeProductHashids.encode(id), // Assuming you want to convert id to string
      })),
      pageCount,
      page,
      pageSize,
      total,
    };
  }

}
