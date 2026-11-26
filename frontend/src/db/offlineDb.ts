import Dexie, { type Table } from 'dexie'
import type { CreateReportPayload } from '../services/reportService'
import type { ClaimTicket, UserReportItem } from '../types/lostFound'
import { INITIAL_CLAIM_TICKETS, MY_USER_REPORTS } from '../data/mockItems'

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
  claimTickets!: Table<ClaimTicket, string>
  myReports!: Table<UserReportItem, string>

  constructor() {
    super('SukaKetemuDB')
    this.version(1).stores({
      offlineReports: '++id, syncStatus, createdAt',
    })

    this.version(2).stores({
      offlineReports: '++id, syncStatus, createdAt',
      claimTickets: 'id, status, createdAt',
      myReports: 'id, status, reportedDate',
    }).upgrade(async (tx) => {
      // Seed initial claim tickets if empty
      const existingTickets = await tx.table('claimTickets').count()
      if (existingTickets === 0) {
        await tx.table('claimTickets').bulkAdd(INITIAL_CLAIM_TICKETS)
      }
      // Seed initial user reports if empty
      const existingReports = await tx.table('myReports').count()
      if (existingReports === 0) {
        await tx.table('myReports').bulkAdd(MY_USER_REPORTS)
      }
    })
  }
}

export const db = new SukaKetemuDatabase()

// Seed initial mock data if database is empty
export async function ensureDbSeeded() {
  try {
    const ticketCount = await db.claimTickets.count()
    if (ticketCount === 0) {
      await db.claimTickets.bulkAdd(INITIAL_CLAIM_TICKETS)
    }

    const reportCount = await db.myReports.count()
    if (reportCount === 0) {
      await db.myReports.bulkAdd(MY_USER_REPORTS)
    }
  } catch (err) {
    console.warn('Seeding Dexie skipped:', err)
  }
}
