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
  posId?: string
  locationDetail: string
  timeAgo?: string
  reportedDate?: string
  isPrivacySensitive?: boolean
  privacyReason?: string
}

export type DateRangeOption = 'all' | 'today' | '3days' | '7days' | '30days'

export interface FilterCriteria {
  category: ItemCategory
  posId: string // 'all' | 'pos-fst-lobby' | 'pos-gerbang-barat' | 'pos-lab-terpadu' | 'dibawa_penemu'
  custody: 'all' | 'pos_satpam' | 'dibawa_penemu'
  dateRange: DateRangeOption
}

export const DEFAULT_FILTER_CRITERIA: FilterCriteria = {
  category: 'all',
  posId: 'all',
  custody: 'all',
  dateRange: 'all',
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

export type AiSignalType = 'visual' | 'text' | 'location' | 'time'

export interface AiMatchEvidence {
  signal: AiSignalType
  factor: string
  description: string
  weightPercent: number
  scorePercent: number
}

export interface AiMatchItem {
  id: string
  lostReportId: string
  rank: number
  lostItemTitle: string
  lostItemDescription?: string
  lostItemImageUrl?: string
  hasReferencePhoto: boolean
  foundItemId: string
  foundItemTitle: string
  foundItemCategory: ItemCategory
  foundItemCategoryLabel: string
  foundItemImageUrl: string
  isPrivacySensitive?: boolean
  foundLocation: string
  custody: CustodyStatus
  custodyPos?: string
  matchScore: number
  timeAgo: string
  evidenceList: AiMatchEvidence[]
  status: 'unresolved' | 'claimed' | 'rejected'
}

export interface ReportFormData {
  reportType: ReportType
  photoUrl: string
  photoFile?: File | null
  compressionStats?: {
    originalSize: number
    compressedSize: number
    percentSaved: number
  } | null
  isPrivacyBlur: boolean
  timeLost?: string
  gedung: string
  lantai: string
  ruangan: string
  category: ItemCategory
  title: string
  description: string
  custodyStatus: 'satpam' | 'penemu'
  posSatpam: string
  secretFeature?: string
  contactPhone: string
}

export type UserReportStatus = 'mencari' | 'cocok_ai' | 'dititipkan' | 'selesai'

export type AiProcessingStatus = 'READY' | 'PENDING_VECTOR'

export interface UserReportItem {
  id: string
  type: ReportType
  title: string
  description?: string
  category: ItemCategory
  categoryLabel: string
  imageUrl?: string
  hasReferencePhoto?: boolean
  locationDetail: string
  reportedDate: string
  status: UserReportStatus
  statusLabel: string
  aiStatus?: AiProcessingStatus
  aiMatchCount?: number
  custody?: CustodyStatus
  posName?: string
}

