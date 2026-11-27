import { useState, useMemo, useCallback, useEffect, useRef, type SetStateAction } from 'react'
import type { LostFoundItem, PosSatpamInfo, FilterCriteria, ItemCategory } from '../types/lostFound'
import { DEFAULT_FILTER_CRITERIA } from '../types/lostFound'
import { filterLostFoundItems } from '../data/mockItems'
import { getFilterLabels, matchPosSatpam } from '../utils/filterUtils'

export function useLostFoundFilter(items: LostFoundItem[], posList: PosSatpamInfo[]) {
  const [criteria, setCriteriaState] = useState<FilterCriteria>(DEFAULT_FILTER_CRITERIA)
  const [searchQuery, setSearchQueryState] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const triggerLoading = useCallback((durationMs = 280) => {
    setIsLoading(true)
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setIsLoading(false)
      timerRef.current = null
    }, durationMs)
  }, [])

  const setCriteria = useCallback(
    (updater: SetStateAction<FilterCriteria>) => {
      setCriteriaState(updater)
      triggerLoading()
    },
    [triggerLoading]
  )

  const setSearchQuery = useCallback(
    (q: string) => {
      setSearchQueryState(q)
      triggerLoading()
    },
    [triggerLoading]
  )

  const labels = useMemo(() => getFilterLabels(criteria, posList), [criteria, posList])
  const isFiltered = searchQuery.trim() !== '' || labels.activeCount > 0

  const filteredItems = useMemo(
    () => filterLostFoundItems(items, criteria, searchQuery),
    [items, criteria, searchQuery]
  )

  const resetFilters = useCallback(() => {
    setCriteriaState(DEFAULT_FILTER_CRITERIA)
    setSearchQueryState('')
    triggerLoading()
  }, [triggerLoading])

  const setCategory = useCallback(
    (cat: ItemCategory) => {
      setCriteriaState((prev) => ({ ...prev, category: cat }))
      triggerLoading()
    },
    [triggerLoading]
  )

  const filterByPosName = useCallback(
    (posName: string) => {
      const matched = matchPosSatpam(posList, posName)
      if (matched) {
        setCriteriaState((prev) => ({ ...prev, posId: matched.id }))
      } else {
        setSearchQueryState(posName)
      }
      triggerLoading()
    },
    [posList, triggerLoading]
  )

  const refresh = useCallback(() => {
    triggerLoading(400)
  }, [triggerLoading])

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
