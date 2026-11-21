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
