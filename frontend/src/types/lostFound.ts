export type ReportType = 'lost' | 'found'

export type ItemCategory = 
  | 'all'
  | 'elektronik'
  | 'dokumen'
  | 'botol'
  | 'tas'
  | 'ibadah'
  | 'lainnya'

export type CustodyStatus = 'pos_satpam' | 'dibawa_penemu'

export interface LostFoundItem {
  id: string
  title: string
  category: ItemCategory
  categoryLabel: string
  imageUrl: string
  imageAlt: string
  custody: CustodyStatus
  locationDetail: string
  timeAgo?: string
  isPrivacySensitive?: boolean
  privacyReason?: string
}

export interface PosSatpamInfo {
  id: string
  name: string
  code: string
  location: string
  officer: string
  shift: string
  storedItemsCount: number
  operatingHours: string
}

export type ClaimStatus = 'waiting_review' | 'ready_for_pickup' | 'completed' | 'cancelled'

export interface ClaimTimelineStep {
  step: number
  title: string
  desc: string
  isDone: boolean
  isCurrent: boolean
}

export interface ClaimTicket {
  id: string
  ticketNumber: string
  itemTitle: string
  itemCategory: ItemCategory
  categoryLabel: string
  itemImageUrl: string
  posLocation: string
  status: ClaimStatus
  statusLabel: string
  otpCode: string
  createdAt: string
  pickupDeadline: string
  matchedSecretFeature: string
  timeline: ClaimTimelineStep[]
}

export interface AiMatchEvidence {
  factor: string
  description: string
  scorePercent: number
}

export interface AiMatchItem {
  id: string
  lostItemTitle: string
  lostItemImageUrl: string
  foundItemTitle: string
  foundItemImageUrl: string
  foundLocation: string
  custodyPos: string
  matchScore: number
  timeAgo: string
  evidenceList: AiMatchEvidence[]
  status: 'unresolved' | 'claimed' | 'rejected'
}
