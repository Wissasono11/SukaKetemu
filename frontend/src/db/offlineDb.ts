import Dexie, { type Table } from 'dexie'
import type { CreateReportPayload } from '../services/reportService'

export interface OfflineReportItem {
  id?: number
  payload: CreateReportPayload
  photoBlob?: Blob
  photoName?: string
  photoType?: string
  createdAt: string
  syncStatus: 'PENDING' | 'SYNCING' | 'FAILED'
  retryCount: number
  lastError?: string
}

export class SukaKetemuDatabase extends Dexie {
  offlineReports!: Table<OfflineReportItem, number>

  constructor() {
    super('SukaKetemuDB')
    this.version(1).stores({
      offlineReports: '++id, syncStatus, createdAt',
    })
  }
}

export const db = new SukaKetemuDatabase()
