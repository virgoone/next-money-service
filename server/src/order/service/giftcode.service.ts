import { Inject, Injectable } from '@nestjs/common'
import { DBService } from '@/db/service/db.service'
import { Prisma, PrismaClient } from '@prisma/client'

import {
  BucketService,
} from '@/bucket/services/bucket.service'
import { GiftCodeDto } from '../dto/get.dto'
import { GiftCodeHashids } from '@/db/dto/giftcode.dto'

@Injectable()
export class GiftCodeService {
  private readonly db: PrismaClient

  constructor(
    @Inject(BucketService)
    private readonly bucketService: BucketService,
    @Inject(DBService) private readonly dbService: DBService,
  ) {
    this.db = this.dbService.db
  }

  async findByCode(code: string) {
    return this.db.giftCode.findFirst({
      where: {
        code,
      },
    })
  }

  async create(params: Prisma.GiftCodeCreateInput) {
    const giftCode = await this.findByCode(params.code)
    if (giftCode?.id) {
      throw new Error('Gift code already exists')
    }
    return this.db.giftCode.create({
      data: params,
    })
  }

  async update(id: number, params: Prisma.GiftCodeUpdateInput) {
    const giftCode = await this.findByCode(params.code as string)
    if (giftCode?.id !== id) {
      throw new Error('Gift code already exists')
    }
    if (giftCode?.used) {
      throw new Error('Gift code already used')
    }
    return this.db.giftCode.update({
      where: {
        id,
      },
      data: params,
    })
  }

  async delete(id: number) {
    return this.db.giftCode.delete({
      where: {
        id,
      },
    })
  }

  async findById(id: number) {
    return this.db.giftCode.findUnique({
      where: {
        id,
      },
    })
  }

  async findByPage(params: {
    page: number
    id?: number
    pageSize: number
    sort?: string
    from?: string
    state?: string
    code?: string
    to?: string
    operator?: 'or' | 'and'
  }) {
    const { id, code, state, page = 1, pageSize = 10, sort, from, to, operator = 'and' } = params
    const offset = (page - 1) * pageSize;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof GiftCodeDto | undefined, "asc" | "desc" | undefined];

    const whereConditions: Prisma.GiftCodeWhereInput = {};

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

    if (state) {
      whereConditions.used = state === 'disable'
    }

    if (code) {
      whereConditions.code = {
        contains: code,
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
      this.db.giftCode.findMany({
        where,
        take: pageSize,
        skip: offset,
        orderBy: column ? { [column]: order ?? "desc" } : { id: "desc" },
      }),
      this.db.giftCode.count({ where }),
    ]);

    const pageCount = Math.ceil(total / pageSize);

    return {
      list: data.map(({ id, ...rest }) => ({
        ...rest,
        id: GiftCodeHashids.encode(id), // Assuming you want to convert id to string
      })),
      pageCount,
      page,
      pageSize,
      total,
    };
  }

}
