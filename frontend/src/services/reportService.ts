export interface CreateReportPayload {
  type: 'lost' | 'found'
  title: string
  category: string
  description: string
  location: {
    gedung: string
    lantai: string
    ruangan: string
  }
  custody?: 'pos_satpam' | 'dibawa_penemu'
  posId?: string
  secretFeature?: string
  contactPhone?: string
  timeLost?: string
  photoFile?: File | null
  isPrivacyBlur?: boolean
}

export interface ReportSubmitResponse {
  success: boolean
  id: string
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const ALLOWED_UPLOAD_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

/**
 * Service pengiriman laporan ke endpoint Express.js Vercel (POST /api/reports)
 * dengan penanganan fallback otomatis untuk demo & offline.
 */
export async function submitReport(payload: CreateReportPayload): Promise<ReportSubmitResponse> {
  if (payload.photoFile) {
    if (!ALLOWED_UPLOAD_MIME.has(payload.photoFile.type)) {
      throw new Error('Format foto tidak diizinkan. Gunakan JPG, PNG, atau WebP.')
    }
    if (payload.photoFile.size > MAX_UPLOAD_BYTES) {
      throw new Error('Ukuran foto melebihi batas unggah.')
    }
  }

  // ponytail: if VITE_API_BASE_URL is explicitly configured, submit real multipart FormData.
  // Otherwise, simulate network latency and return mock success ID.
  if (import.meta.env.VITE_API_BASE_URL) {
    const formData = new FormData()
    formData.append('type', payload.type)
    formData.append('title', payload.title)
    formData.append('category', payload.category)
    formData.append('description', payload.description)
    formData.append('location', JSON.stringify(payload.location))
    if (payload.custody) formData.append('custody', payload.custody)
    if (payload.posId) formData.append('posId', payload.posId)
    if (payload.secretFeature) formData.append('secretFeature', payload.secretFeature)
    if (payload.contactPhone) formData.append('contactPhone', payload.contactPhone)
    if (payload.timeLost) formData.append('timeLost', payload.timeLost)
    formData.append('isPrivacyBlur', String(Boolean(payload.isPrivacyBlur)))
    if (payload.photoFile) formData.append('photo', payload.photoFile)

    const res = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`Gagal menyimpan laporan: ${res.statusText}`)
    }
    return res.json()
  }

  // Fallback dev simulation
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    success: true,
    id: `rep-${Date.now()}`,
    message: 'Laporan berhasil disimpan.',
  }
}
