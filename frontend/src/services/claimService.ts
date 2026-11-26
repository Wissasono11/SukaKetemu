import type { ClaimTicket, LostFoundItem } from '../types/lostFound'

export interface SubmitClaimRequest {
  item: LostFoundItem
  answer: string
  proofNote?: string
}

export interface RegenerateOtpResponse {
  otpCode: string
  ttlSeconds: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * Cryptographically strong random integer in [min, maxExclusive) using Web Crypto API.
 */
export function secureRandomInt(min: number, maxExclusive: number): number {
  const range = maxExclusive - min
  const array = new Uint32Array(1)
  const limit = Math.floor(0xffffffff / range) * range
  let value: number
  do {
    crypto.getRandomValues(array)
    value = array[0]
  } while (value >= limit)
  return min + (value % range)
}

/**
 * Mengirim jawaban verifikasi klaim ke backend agar pencocokan ciri rahasia dan
 * penerbitan tiket/OTP dilakukan di sisi server.
 */
export async function submitClaimChallenge({
  item,
  answer,
  proofNote,
}: SubmitClaimRequest): Promise<ClaimTicket> {
  if (import.meta.env.VITE_API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        itemId: item.id,
        answer,
        proofNote: proofNote || undefined,
      }),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => null)
      throw new Error(errBody?.message || `Verifikasi klaim gagal (${res.status})`)
    }

    return res.json()
  }

  // Fallback mode demo lokal: tidak langsung menyetujui kepemilikan di sisi klien.
  await new Promise((resolve) => setTimeout(resolve, 600))
  const isPosSatpam = item.custody === 'pos_satpam'
  const randomNum = secureRandomInt(1000, 10000)

  return {
    id: `TKT-${randomNum}`,
    ticketNumber: `SK-2026-${randomNum}`,
    itemTitle: item.title,
    itemCategory: item.category,
    categoryLabel: item.categoryLabel,
    itemImageUrl: item.imageUrl,
    posLocation: isPosSatpam
      ? item.locationDetail.split('•')[0].trim() || 'Pos Satpam FST'
      : 'Masih Dibawa Penemu (Area Kampus)',
    status: 'waiting_review',
    statusLabel: 'Menunggu Verifikasi Petugas',
    otpCode: '------',
    createdAt: new Date().toISOString(),
    pickupDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    matchedSecretFeature: answer,
    timeline: [
      {
        step: 1,
        title: 'Klaim Diajukan',
        desc: 'Jawaban ciri rahasia dikirim untuk verifikasi petugas/penemu.',
        isDone: true,
        isCurrent: false,
      },
      {
        step: 2,
        title: 'Verifikasi Kepemilikan',
        desc: 'Menunggu validasi server/satpam sebelum OTP terbit.',
        isDone: false,
        isCurrent: true,
      },
      {
        step: 3,
        title: 'Selesai',
        desc: 'Pengecekan fisik oleh satpam/penemu.',
        isDone: false,
        isCurrent: false,
      },
    ],
  }
}

/**
 * Meminta pembaruan OTP dinamis 6-digit dari backend (Redis TTL).
 */
export async function regenerateClaimOtp(ticketId: string): Promise<RegenerateOtpResponse> {
  if (import.meta.env.VITE_API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}/claims/${encodeURIComponent(ticketId)}/otp`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error(`Gagal memperbarui OTP (${res.status})`)
    }

    return res.json()
  }

  // Fallback demo lokal dengan CSPRNG Web Crypto
  await new Promise((resolve) => setTimeout(resolve, 450))
  return {
    otpCode: String(secureRandomInt(100000, 1000000)),
    ttlSeconds: 300,
  }
}
