import { registerAs } from '@nestjs/config'

export default registerAs(
  'bucket',
  (): Record<string, any> => ({
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      cdnUrl: process.env.S3_URL_BASE,
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET,
    },
  }),
)
