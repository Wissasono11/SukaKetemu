import type { FilterCriteria, PosSatpamInfo } from '../types/lostFound'

export interface FilterLabels {
  activeCount: number
  posLabel: string | null
  dateLabel: string | null
  custodyLabel: string | null
  hasHiddenFilters: boolean
}

export function getFilterLabels(
  criteria: FilterCriteria,
  posList: PosSatpamInfo[]
): FilterLabels {
  const activeCount = [
    criteria.category,
    criteria.posId,
    criteria.custody,
    criteria.dateRange,
  ].filter((v) => v !== 'all').length

  const posLabel =
    criteria.posId !== 'all'
      ? criteria.posId === 'dibawa_penemu'
        ? 'Dibawa Penemu'
        : posList.find((p) => p.id === criteria.posId)?.name.replace('Pos Satpam ', '') || criteria.posId
      : null

  const dateLabel =
    criteria.dateRange === 'today'
      ? 'Hari Ini (<24 Jam)'
      : criteria.dateRange === '3days'
      ? '3 Hari Terakhir'
      : criteria.dateRange === '7days'
      ? '7 Hari Terakhir'
      : criteria.dateRange === '30days'
      ? '30 Hari Terakhir'
      : null

  const custodyLabel =
    criteria.custody === 'pos_satpam'
      ? 'Di Pos Satpam'
      : criteria.custody === 'dibawa_penemu'
      ? 'Di Penemu'
      : null

  const hasHiddenFilters =
    criteria.posId !== 'all' || criteria.custody !== 'all' || criteria.dateRange !== 'all'

  return {
    activeCount,
    posLabel,
    dateLabel,
    custodyLabel,
    hasHiddenFilters,
  }
}

export function matchPosSatpam(
  posList: PosSatpamInfo[],
  query: string
): PosSatpamInfo | undefined {
  return posList.find((p) => query.includes(p.code) || query.includes(p.name))
}
