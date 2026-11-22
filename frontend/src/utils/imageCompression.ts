import imageCompression from 'browser-image-compression'

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  previewUrl: string
}

export async function compressReportImage(file: File): Promise<CompressionResult> {
  const options = {
    maxSizeMB: 1.5, // Maksimal 1.5 MB untuk Vercel Serverless body parser
    maxWidthOrHeight: 1920, // Resolusi Full HD optimal untuk multimodal AI
    useWebWorker: true, // WebWorker terisolasi agar UI tidak freeze/lag
    fileType: 'image/jpeg' as const,
  }

  try {
    const compressedBlob = await imageCompression(file, options)
    const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' })
    const previewUrl = URL.createObjectURL(compressedBlob)

    return {
      file: compressedFile,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      previewUrl,
    }
  } catch (error) {
    console.error('Gagal mengompresi gambar laporan:', error)
    throw error
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}
