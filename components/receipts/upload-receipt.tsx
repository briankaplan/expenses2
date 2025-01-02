'use client'

import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { COLLECTIONS, STORAGE_PATHS } from '@/lib/firebase-config'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

export function UploadReceipt() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = formData.get('file') as File

    // Validate file size for free tier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 10MB',
        variant: 'destructive',
      })
      return
    }

    try {
      setUploading(true)

      // Compress image if needed
      let fileToUpload = file
      if (file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file)
      }

      // Upload to storage
      const fileName = `${Date.now()}-${file.name}`
      const storageRef = ref(storage, `${STORAGE_PATHS.RECEIPTS}/${user?.uid}/${fileName}`)
      await uploadBytes(storageRef, fileToUpload)
      const downloadUrl = await getDownloadURL(storageRef)

      // Save metadata
      await addDoc(collection(db, COLLECTIONS.RECEIPTS), {
        fileName: file.name,
        fileUrl: downloadUrl,
        fileSize: fileToUpload.size,
        mimeType: file.type,
        userId: user?.uid,
        createdAt: new Date().toISOString()
      })

      toast({
        title: 'Success',
        description: 'Receipt uploaded successfully',
      })

      event.currentTarget.reset()
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload receipt',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Input
            type="file"
            name="file"
            accept="image/*,application/pdf"
            disabled={uploading}
          />
        </div>
        <Button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Receipt'}
        </Button>
      </form>
    </Card>
  )
}

// Helper function to compress images
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Failed to get canvas context'))

      // Calculate new dimensions (max 1024px)
      let width = img.width
      let height = img.height
      if (width > 1024) {
        height = Math.floor(height * (1024 / width))
        width = 1024
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Failed to compress image'))
          resolve(blob)
        },
        'image/jpeg',
        0.8
      )
    }
    img.onerror = reject
  })
} 