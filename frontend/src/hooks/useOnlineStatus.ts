import { useState, useEffect, useCallback } from 'react'
import { sileo } from 'sileo'
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
      const { successCount, failedCount } = await syncPendingReports()
      await refreshPendingCount()
      if (successCount > 0 && failedCount === 0) {
        sileo.success({
          title: 'Sinkronisasi berhasil',
          description: `${successCount} laporan offline telah terkirim.`,
        })
      } else if (successCount > 0 && failedCount > 0) {
        sileo.warning({
          title: 'Sebagian laporan tersinkronisasi',
          description: `${successCount} terkirim, ${failedCount} gagal. Akan dicoba lagi nanti.`,
        })
      } else if (failedCount > 0) {
        sileo.error({
          title: 'Sinkronisasi laporan gagal',
          description: `${failedCount} laporan masih di antrean. Periksa koneksi Anda.`,
        })
      }
    } catch {
      sileo.error({
        title: 'Gagal menyinkronkan antrean',
        description: 'Terjadi gangguan jaringan. Tekan Kirim untuk mencoba lagi.',
      })
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
