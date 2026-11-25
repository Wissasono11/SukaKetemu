import { db, type OfflineReportItem } from '../db/offlineDb'
import { submitReport, type CreateReportPayload, type ReportSubmitResponse } from './reportService'

export async function enqueueOfflineReport(payload: CreateReportPayload): Promise<number> {
  let photoBlob: Blob | undefined
  let photoName: string | undefined
  let photoType: string | undefined

  if (payload.photoFile) {
    photoBlob = payload.photoFile
    photoName = payload.photoFile.name
    photoType = payload.photoFile.type
  }

  // Clone payload without non-serializable File object for safe IndexedDB storage
  const serializablePayload: CreateReportPayload = {
    ...payload,
    photoFile: null,
  }

  const id = await db.offlineReports.add({
    payload: serializablePayload,
    photoBlob,
    photoName,
    photoType,
    createdAt: new Date().toISOString(),
    syncStatus: 'PENDING',
    retryCount: 0,
  })

  return id
}

export async function getPendingOfflineReportsCount(): Promise<number> {
  return await db.offlineReports.where('syncStatus').equals('PENDING').count()
}

export async function getAllOfflineReports(): Promise<OfflineReportItem[]> {
  return await db.offlineReports.toArray()
}

export async function syncPendingReports(
  onProgress?: (synced: number, total: number) => void
): Promise<{ successCount: number; failedCount: number }> {
  if (!navigator.onLine) {
    return { successCount: 0, failedCount: 0 }
  }

  const pending = await db.offlineReports.where('syncStatus').equals('PENDING').toArray()
  if (pending.length === 0) {
    return { successCount: 0, failedCount: 0 }
  }

  let successCount = 0
  let failedCount = 0

  for (let i = 0; i < pending.length; i++) {
    const item = pending[i]
    if (!item.id) continue

    await db.offlineReports.update(item.id, { syncStatus: 'SYNCING' })

    try {
      // Reconstitute File from Blob if available
      let reconstitutedFile: File | null = null
      if (item.photoBlob && item.photoName) {
        reconstitutedFile = new File([item.photoBlob], item.photoName, {
          type: item.photoType || 'image/jpeg',
        })
      }

      const uploadPayload: CreateReportPayload = {
        ...item.payload,
        photoFile: reconstitutedFile,
      }

      const res: ReportSubmitResponse = await submitReport(uploadPayload)
      if (res.success) {
        await db.offlineReports.delete(item.id)
        successCount++
      } else {
        throw new Error(res.message || 'Sync failed')
      }
    } catch (err: unknown) {
      failedCount++
      const message = err instanceof Error ? err.message : 'Unknown sync error'
      await db.offlineReports.update(item.id, {
        syncStatus: 'PENDING',
        retryCount: item.retryCount + 1,
        lastError: message,
      })
    }

    if (onProgress) {
      onProgress(i + 1, pending.length)
    }
  }

  return { successCount, failedCount }
}
