import { db, ensureDbSeeded } from '../db/offlineDb'
import type { ClaimTicket, UserReportItem, ItemCategory } from '../types/lostFound'
import { INITIAL_CLAIM_TICKETS, MY_USER_REPORTS } from '../data/mockItems'
import type { CreateReportPayload } from './reportService'

// Claim Tickets Persistence
export async function getClaimTickets(): Promise<ClaimTicket[]> {
  await ensureDbSeeded()
  const tickets = await db.claimTickets.toArray()
  return tickets.length > 0 ? tickets : INITIAL_CLAIM_TICKETS
}

export async function saveClaimTicket(ticket: ClaimTicket): Promise<void> {
  await ensureDbSeeded()
  await db.claimTickets.put(ticket)
}

export async function updateClaimTicketStatus(
  ticketId: string,
  status: ClaimTicket['status'],
  statusLabel: string
): Promise<void> {
  await ensureDbSeeded()
  await db.claimTickets.update(ticketId, { status, statusLabel })
}

// User Reports Persistence
export async function getMyReports(): Promise<UserReportItem[]> {
  await ensureDbSeeded()
  const reports = await db.myReports.toArray()
  // Return sorted newest first
  return reports.length > 0
    ? reports.sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime())
    : MY_USER_REPORTS
}

export async function addMyReportFromSubmission(
  payload: CreateReportPayload,
  generatedId?: string
): Promise<UserReportItem> {
  await ensureDbSeeded()

  const id = generatedId || `REP-${Date.now()}`
  const isPos = payload.custody === 'pos_satpam'

  // Map category to readable label
  const categoryLabels: Record<string, string> = {
    elektronik: 'Elektronik',
    dokumen: 'Dokumen/KTM',
    botol: 'Botol Minum',
    tas: 'Tas/Dompet',
    ibadah: 'Perlengkapan Ibadah',
    lainnya: 'Lainnya',
  }

  const newReport: UserReportItem = {
    id,
    type: payload.type,
    title: payload.title,
    category: (payload.category as ItemCategory) || 'lainnya',
    categoryLabel: categoryLabels[payload.category] || 'Lainnya',
    imageUrl:
      payload.photoFile && URL.createObjectURL
        ? URL.createObjectURL(payload.photoFile)
        : 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    locationDetail: `${payload.location.gedung} - ${payload.location.ruangan}`,
    reportedDate: new Date().toISOString(),
    status: isPos ? 'dititipkan' : 'mencari',
    statusLabel: isPos ? 'Dititipkan di Pos' : payload.type === 'found' ? 'Dipegang Penemu' : 'Sedang Dicari',
    custody: payload.custody,
    posName: payload.posId,
  }

  await db.myReports.put(newReport)
  return newReport
}
