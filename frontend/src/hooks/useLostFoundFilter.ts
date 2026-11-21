import { useState, useMemo, useCallback } from 'react'
import type { LostFoundItem, PosSatpamInfo, FilterCriteria, ItemCategory } from '../types/lostFound'
import { DEFAULT_FILTER_CRITERIA } from '../types/lostFound'
import { filterLostFoundItems } from '../data/mockItems'
import { getFilterLabels, matchPosSatpam } from '../utils/filterUtils'

export function useLostFoundFilter(items: LostFoundItem[], posList: PosSatpamInfo[]) {
  const [criteria, setCriteria] = useState<FilterCriteria>(DEFAULT_FILTER_CRITERIA)
  const [searchQuery, setSearchQuery] = useState('')

  const labels = useMemo(() => getFilterLabels(criteria, posList), [criteria, posList])

  const isFiltered = searchQuery.trim() !== '' || labels.activeCount > 0

  const filteredItems = useMemo(
    () => filterLostFoundItems(items, criteria, searchQuery),
    [items, criteria, searchQuery]
  )

  const resetFilters = useCallback(() => {
    setCriteria(DEFAULT_FILTER_CRITERIA)
    setSearchQuery('')
  }, [])

  const setCategory = useCallback((cat: ItemCategory) => {
    setCriteria((prev) => ({ ...prev, category: cat }))
  }, [])

  const filterByPosName = useCallback(
    (posName: string) => {
      const matched = matchPosSatpam(posList, posName)
      if (matched) {
        setCriteria((prev) => ({ ...prev, posId: matched.id }))
      } else {
        setSearchQuery(posName)
      }
    },
    [posList]
  )

  return {
    criteria,
    setCriteria,
    searchQuery,
    setSearchQuery,
    setCategory,
    filteredItems,
    labels,
    isFiltered,
    resetFilters,
    filterByPosName,
  }
}
