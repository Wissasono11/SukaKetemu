import { useState, useMemo, useCallback, useEffect } from 'react'
import type { LostFoundItem, PosSatpamInfo, FilterCriteria, ItemCategory } from '../types/lostFound'
import { DEFAULT_FILTER_CRITERIA } from '../types/lostFound'
import { filterLostFoundItems } from '../data/mockItems'
import { getFilterLabels, matchPosSatpam } from '../utils/filterUtils'

export function useLostFoundFilter(items: LostFoundItem[], posList: PosSatpamInfo[]) {
  const [criteria, setCriteria] = useState<FilterCriteria>(DEFAULT_FILTER_CRITERIA)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const labels = useMemo(() => getFilterLabels(criteria, posList), [criteria, posList])
  const isFiltered = searchQuery.trim() !== '' || labels.activeCount > 0

  // Emulate rapid backend network fetching with zero layout shift
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 280)
    return () => clearTimeout(timer)
  }, [criteria, searchQuery])

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

  const refresh = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 400)
  }, [])

  return {
    criteria,
    setCriteria,
    searchQuery,
    setSearchQuery,
    setCategory,
    filteredItems,
    labels,
    isFiltered,
    isLoading,
    setIsLoading,
    refresh,
    resetFilters,
    filterByPosName,
  }
}
