import { Readable } from 'stream'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  AbortMultipartUploadCommand,
  AbortMultipartUploadCommandInput,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandInput,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  ObjectIdentifier,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  UploadPartCommand,
  UploadPartCommandInput,
  UploadPartRequest,
} from '@aws-sdk/client-s3'

import {
  IBucketS3MultipartParts,
  IBucketS3MultipartResponse,
  IBucketS3PutItemOptions,
  IBucketS3Response,
} from '../interfaces/bucket.interface'
import { IBucketS3Service } from '../interfaces/bucket.s3-service.interface'
import {
  BucketS3MultipartPartsSerialization,
  BucketS3MultipartSerialization,
} from '../serializations/bucket.s3-multipart.serialization'
import { BucketS3Serialization } from '../serializations/bucket.s3.serialization'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class BucketService implements IBucketS3Service {
  private name = BucketService.name
  private readonly s3Client: S3Client
  private readonly bucket: string
  private readonly cdnUrl: string

  constructor(private readonly configService: ConfigService) {
    const s3 = this.configService.get('bucket.s3')
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: s3.accessKeyId,
        secretAccessKey: s3.secretAccessKey,
      },
      region: s3.region,
      endpoint: s3.endpoint,
    })
    this.bucket = s3.bucket
    this.cdnUrl = s3.cdnUrl
  }

  async checkConnection(): Promise<Record<string, any>> {
    const command: HeadBucketCommand = new HeadBucketCommand({
      Bucket: this.bucket,
    })

    try {
      const check: Record<string, any> = await this.s3Client.send(command)

      return check
    } catch (err: any) {
      throw err
    }
  }

  async listBucket(): Promise<string[]> {
    const command: ListBucketsCommand = new ListBucketsCommand({})
    const listBucket: Record<string, any> = await this.s3Client.send(command)
    return listBucket.Buckets.map((val: Record<string, any>) => val.Name)
  }

  async listItemInBucket(
    prefix?: string,
    bucket = this.bucket,
  ): Promise<BucketS3Serialization[]> {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    })
    const listItems: Record<string, any> = await this.s3Client.send(command)

    return listItems.Contents.map((val: Record<string, any>) => {
      const lastIndex: number = val.Key.lastIndexOf('/')
      const path: string = val.Key.substring(0, lastIndex)
      const filename: string = val.Key.substring(lastIndex, val.Key.length)
      const mime: string = filename
        .substring(filename.lastIndexOf('.') + 1, filename.length)
        .toLocaleUpperCase()

      return {
        path,
        pathWithFilename: val.Key,
        filename: filename,
        completedUrl: `${this.cdnUrl}/${val.Key}`,
        baseUrl: this.cdnUrl,
        mime,
        bucket,
        type: 'aliyun',
      }
    })
  }

  async getItemInBucket(
    filename: string,
    path?: string,
    bucket = this.bucket,
  ): Promise<Record<string, any>> {
    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`

    const key: string = path ? `${path}/${filename}` : filename
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const item: Record<string, any> = await this.s3Client.send(command)

    return item.Body
  }

  async putItemInBucket(
    filename: string,
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
    options?: IBucketS3PutItemOptions,
    bucket = this.bucket,
  ): Promise<BucketS3Serialization> {
    let path: string = options && options.path ? options.path : undefined
    const acl = options && options.acl ? options.acl : 'public-read'

    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toLowerCase()
    const key: string = path ? `${path}/${filename}` : filename
    const putObjectOption: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: content,
      ACL: acl,
    }
    if (options.ContentType) {
      putObjectOption.ContentType = options.ContentType
    }
    const command: PutObjectCommand = new PutObjectCommand(putObjectOption)

    await this.s3Client.send(command)

    return {
      path,
      pathWithFilename: key,
      filename: filename,
      completedUrl: `${this.cdnUrl}/${key}`,
      baseUrl: this.cdnUrl,
      mime,
      bucket,
      type: 'aliyun',
    }
  }

  async deleteItemInBucket(
    filename: string,
    bucket = this.bucket,
  ): Promise<void> {
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: filename,
    })

    try {
      await this.s3Client.send(command)
    } catch (e) {
      throw e
    }
  }

  async deleteItemsInBucket(
    filenames: string[],
    bucket = this.bucket,
  ): Promise<void> {
    const keys: ObjectIdentifier[] = filenames.map((val) => ({
      Key: val,
    }))
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: keys,
      },
    })

    try {
      await this.s3Client.send(command)
    } catch (e) {
      throw e
    }
  }

  async deleteFolder(dir: string, bucket = this.bucket): Promise<void> {
    const commandList: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: dir,
    })
    const lists = await this.s3Client.send(commandList)

    try {
      const listItems = lists.Contents.map((val) => ({
        Key: val.Key,
      }))
      const commandDeleteItems: DeleteObjectsCommand = new DeleteObjectsCommand(
        {
          Bucket: bucket,
          Delete: {
            Objects: listItems,
          },
        },
      )

      await this.s3Client.send(commandDeleteItems)

      const commandDelete: DeleteObjectCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: dir,
      })
      await this.s3Client.send(commandDelete)

      return
    } catch (e) {
      throw e
    }
  }
  async createMultiPart(
    filename: string,
    options?: IBucketS3PutItemOptions,
    bucket = this.bucket,
  ): Promise<BucketS3MultipartSerialization> {
    let path: string = options && options.path ? options.path : undefined
    const acl = options && options.acl ? options.acl : 'public-read'

    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toUpperCase()
    const key: string = path ? `${path}/${filename}` : filename

    const multiPartInput: CreateMultipartUploadCommandInput = {
      Bucket: bucket,
      Key: key,
      ACL: acl,
    }
    const multiPartCommand: CreateMultipartUploadCommand =
      new CreateMultipartUploadCommand(multiPartInput)

    try {
      const response = await this.s3Client.send(multiPartCommand)

      return {
        uploadId: response.UploadId,
        path,
        pathWithFilename: key,
        filename: filename,
        completedUrl: `${this.cdnUrl}/${key}`,
        baseUrl: this.cdnUrl,
        mime,
        bucket,
        type: 'aliyun',
      }
    } catch (err: any) {
      throw err
    }
  }

  async uploadPart(
    path: string,
    content: UploadPartRequest['Body'] | string | Uint8Array | Buffer,
    uploadId: string,
    partNumber: number,
    bucket = this.bucket,
  ): Promise<BucketS3MultipartPartsSerialization> {
    const uploadPartInput: UploadPartCommandInput = {
      Bucket: bucket,
      Key: path,
      Body: content,
      PartNumber: partNumber,
      UploadId: uploadId,
    }
    const uploadPartCommand: UploadPartCommand = new UploadPartCommand(
      uploadPartInput,
    )

    try {
      const { ETag } = await this.s3Client.send(uploadPartCommand)

      return {
        ETag,
        PartNumber: partNumber,
      }
    } catch (err: any) {
      throw err
    }
  }

  async completeMultipart(
    path: string,
    uploadId: string,
    parts: CompletedPart[],
    bucket = this.bucket,
  ): Promise<void> {
    const completeMultipartInput: CompleteMultipartUploadCommandInput = {
      Bucket: bucket,
      Key: path,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    }

    const completeMultipartCommand: CompleteMultipartUploadCommand =
      new CompleteMultipartUploadCommand(completeMultipartInput)

    try {
      await this.s3Client.send(completeMultipartCommand)

      return
    } catch (err: any) {
      throw err
    }
  }

  async getSts(filename: string, path?: string, bucket = this.bucket) {
    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`

    const key: string = path ? `${path}/${filename}` : filename
    const putCmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    const getCmd = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    const putUrl = await getSignedUrl(this.s3Client, putCmd, {
      expiresIn: 3600,
    })
    const getUrl = await getSignedUrl(this.s3Client, getCmd, {
      expiresIn: 7200,
    })
    const endpoint = this.cdnUrl

    return {
      putUrl: putUrl,
      url: getUrl,
      endpoint,
      key,
      bucket,
    }
  }

  async abortMultipart(
    path: string,
    uploadId: string,
    bucket = this.bucket,
  ): Promise<void> {
    const abortMultipartInput: AbortMultipartUploadCommandInput = {
      Bucket: bucket,
      Key: path,
      UploadId: uploadId,
    }

    const abortMultipartCommand: AbortMultipartUploadCommand =
      new AbortMultipartUploadCommand(abortMultipartInput)

    try {
      await this.s3Client.send(abortMultipartCommand)

      return
    } catch (err: any) {
      throw err
    }
  }
}
