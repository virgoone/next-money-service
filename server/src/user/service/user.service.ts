import { randomBytes } from 'node:crypto'

import { Inject, Injectable } from '@nestjs/common'
import { DBService } from '@/db/service/db.service'
import { Prisma, PrismaClient } from '@prisma/client'

import { BucketS3Serialization } from '@/bucket/serializations/bucket.s3.serialization'
import {
  BucketService,
} from '@/bucket/services/bucket.service'
import { HashUtil } from '@/utils/hash'
import { UserState } from '@/auth/type'
import { UserHashids } from '@/db/dto/user.dto'
import { UserDto } from '@/db/dto/type'

@Injectable()
export class UserService {
  private readonly uploadPath: string = '/user/avatar'
  private readonly db: PrismaClient

  constructor(
    @Inject(BucketService)
    private readonly bucketService: BucketService,
    @Inject(DBService) private readonly dbService: DBService,
  ) {
    this.db = this.dbService.db
  }

  async createSalt(length: number): Promise<string> {
    return HashUtil.randomSalt(length)
  }

  async findByPage(params: {
    page: number
    id?: number
    pageSize: number
    sort?: string
    from?: string
    state?: string
    to?: string
    operator?: 'or' | 'and'
  }) {
    const { id, state, page = 1, pageSize = 10, sort, from, to, operator = 'and' } = params
    const offset = (page - 1) * pageSize;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof UserDto | undefined, "asc" | "desc" | undefined];

    const whereConditions: Prisma.UserWhereInput = {};

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
      whereConditions.state = state
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
      this.db.user.findMany({
        where,
        take: pageSize,
        skip: offset,
        select: {
          id: true,
          email: true,
          avatar: true,
          name: true,
          phone: true,
          state: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: column ? { [column]: order ?? "desc" } : { id: "desc" },
      }),
      this.db.user.count({ where }),
    ]);

    const pageCount = Math.ceil(total / pageSize);

    return {
      list: data.map(({ id, ...rest }) => ({
        ...rest,
        id: UserHashids.encode(id), // Assuming you want to convert id to string
      })),
      pageCount,
      page,
      pageSize,
      total,
    };
  }

  async signup(params: { name: string, password: string, email: string, phone?: string, emailVerified?: boolean }) {
    const { name, password, email, phone, emailVerified } = params
    const salt = await this.createSalt(16)
    const hashedPassword: string = await HashUtil.bcrypt(password, salt)
    const user = await this.db.user.create({
      data: {
        name,
        email,
        salt,
        phone,
        hashedPassword,
        state: UserState.Active,
        emailVerified: emailVerified ? {
          verified: true,
          verifiedAt: new Date(),
        } : null,
      }
    })
    return UserHashids.encode(user.id)
  }


  async create(data: { name: string, password: string, email: string, phone?: string }) {
    const res = await this.signup(data)

    return res
  }


  async findOneById(id: number) {
    return this.db.user.findUnique({
      where: {
        id,
      },
    })
  }

  async findOneByUsername(name: string) {
    return this.db.user.findFirst({
      where: {
        name,
      },
    })
  }


  // find user by email
  async findOneByEmail(email: string) {
    const user = await this.db.user.findFirst({
      where: {
        email,
      },
    })

    return user
  }

  async updateAvatarUrl(url: string, userid: number) {
    await this.db.user.update({
      where: {
        id: userid,
      },
      data: {
        avatar: url,
      },
    })

    return await this.findOneById(userid)
  }

  createRandomFilename(): Record<string, any> {
    const filename: string = randomBytes(20).toString('hex')

    return {
      path: this.uploadPath,
      filename: filename,
    }
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await HashUtil.bcryptCompare(password, hashedPassword)
  }

  async updateUser(userid: number, data: { name?: string, password?: string, email?: string, avatar?: string, phone?: string }) {
    const { name, avatar, password, email, phone } = data

    const updateData: Prisma.UserUpdateInput = {
    }
    if (password) {
      const salt = await this.createSalt(16)
      const hashedPassword: string = await HashUtil.bcrypt(password, salt)
      updateData.hashedPassword = hashedPassword
      updateData.salt = salt
    }
    if (phone) {
      updateData.phone = phone
    }
    if (name) {
      updateData.name = name
    }
    if (email) {
      updateData.email = email
      updateData.emailVerified = {
        verified: true,
        verifiedAt: new Date(),
      }
    }
    if (avatar) {
      updateData.avatar = avatar
    }
    const user = await this.db.user.update({
      where: {
        id: userid,
      },
      data: updateData
    })
    return user
  }

  async updateAvatar(image: Express.Multer.File, userid: number) {
    const path = this.createRandomFilename()
    const mime: string = image.filename
      .substring(image.filename.lastIndexOf('.') + 1, image.filename.length)
      .toLocaleUpperCase()
    try {
      const bucketResult: BucketS3Serialization =
        await this.bucketService.putItemInBucket(
          `${path.filename}.${mime}`,
          image.buffer,
          {
            path: `${path.path}/${userid}`,
            ContentType: `image/${mime}`,
          },
        )

      await this.db.user.update({
        where: {
          id: userid,
        },
        data: {
          avatar: bucketResult.completedUrl,
        },
      })
    } catch (error) {
      throw error
    }

    return await this.findOneById(userid)
  }
}
