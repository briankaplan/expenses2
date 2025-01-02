import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(file: File | Blob, prefix = '') {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const key = prefix ? `${prefix}/${randomUUID()}` : randomUUID()
    const extension = (file as File).name?.split('.').pop() || ''
    const fullKey = extension ? `${key}.${extension}` : key

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fullKey,
      Body: buffer,
      ContentType: file.type,
      // Make the object publicly accessible
      ACL: 'public-read',
    })

    await R2.send(command)

    return `https://${process.env.R2_PUBLIC_DOMAIN}/${fullKey}`
  } catch (error) {
    console.error('R2 upload error:', error)
    throw new Error('Failed to upload file')
  }
}

export function getR2Url(key: string) {
  if (!key) return null
  return `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`
} 