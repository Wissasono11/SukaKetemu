import { useState, useEffect, useCallback } from 'react'
import {
  getPendingOfflineReportsCount,
  syncPendingReports,
} from '../services/offlineSyncService'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getPendingOfflineReportsCount()
      setPendingCount(count)
    } catch {
      // Ignored if DB is busy or unopened
    }
  }, [])

  const triggerSync = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return
    setIsSyncing(true)
    try {
      await syncPendingReports()
      await refreshPendingCount()
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing, refreshPendingCount])

  useEffect(() => {
    let active = true
    getPendingOfflineReportsCount()
      .then((count) => {
        if (active) setPendingCount(count)
      })
      .catch(() => undefined)

    const handleOnline = () => {
      setIsOnline(true)
      void triggerSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
      void refreshPendingCount()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      active = false
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [triggerSync, refreshPendingCount])

  return {
    isOnline,
    pendingCount,
    isSyncing,
    refreshPendingCount,
    triggerSync,
  }
}
