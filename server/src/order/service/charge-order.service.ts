import { Inject, Injectable } from '@nestjs/common'
import { DBService } from '@/db/service/db.service'
import { Prisma, PrismaClient } from '@prisma/client'

import { ChargeOrderDto } from '../dto/get.dto'
import { ChargeOrderHashids } from '@/db/dto/charge-order.dto'

@Injectable()
export class ChargeOrderService {
  private readonly db: PrismaClient

  constructor(
    @Inject(DBService) private readonly dbService: DBService,
  ) {
    this.db = this.dbService.db
  }

  async findById(id: number) {
    const order = await this.db.chargeOrder.findUnique({
      where: {
        id,
      },
    })
    return order
  }

  async findByPage(params: {
    userId?: string
    page: number
    channel?: string
    id?: number
    pageSize: number
    sort?: string
    from?: string
    state?: string
    to?: string
    operator?: 'or' | 'and'
  }) {
    const { id, userId, channel, state, page = 1, pageSize = 10, sort, from, to, operator = 'and' } = params
    const offset = (page - 1) * pageSize;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ChargeOrderDto | undefined, "asc" | "desc" | undefined];

    const whereConditions: Prisma.ChargeOrderWhereInput = {};

    if (id) {
      whereConditions.id = {
        in: [id]
      }
    }

    if (userId) {
      whereConditions.userId = userId
    }

    if (channel) {
      whereConditions.channel = channel
    }

    if (state) {
      whereConditions.phase = state
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
      this.db.chargeOrder.findMany({
        where,
        select: {
          id: true,
          userId: true,
          channel: true,
          amount: true,
          currency: true,
          credit: true,
          phase: true,
          createdAt: true,
          paymentAt: true,
        },
        take: pageSize,
        skip: offset,
        orderBy: column ? { [column]: order ?? "desc" } : { id: "desc" },
      }),
      this.db.chargeOrder.count({ where }),
    ]);

    const pageCount = Math.ceil(total / pageSize);

    return {
      list: data.map(({ id, ...rest }) => ({
        ...rest,
        id: ChargeOrderHashids.encode(id), // Assuming you want to convert id to string
      })),
      pageCount,
      page,
      pageSize,
      total,
    };
  }

}
