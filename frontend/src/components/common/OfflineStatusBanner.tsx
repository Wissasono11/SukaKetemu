import React from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export const OfflineStatusBanner: React.FC = () => {
  const { isOnline, pendingCount, isSyncing, triggerSync } = useOnlineStatus()

  if (isOnline && pendingCount === 0) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full px-3.5 py-2 text-xs flex items-center justify-between transition-all ${
        !isOnline
          ? 'bg-[#FEF3C7] text-[#92400E] border-b border-[#FCD34D]'
          : 'bg-[#E4F1E8] text-[#0F4A2C] border-b border-[#C8E6D3]'
      }`}
    >
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <WifiOff className="w-4 h-4 text-[#D97706] flex-shrink-0 animate-pulse" />
        ) : (
          <Wifi className="w-4 h-4 text-[#155E38] flex-shrink-0" />
        )}
        <div className="flex flex-col text-left">
          <span className="font-bold leading-tight">
            {!isOnline ? 'Mode Luring (Offline)' : 'Koneksi Pulih'}
          </span>
          <span className="text-[10px] opacity-90 leading-tight">
            {!isOnline
              ? pendingCount > 0
                ? `${pendingCount} laporan tersimpan di HP & otomatis terkirim saat online.`
                : 'Laporan Anda akan aman tersimpan di HP (IndexedDB).'
              : `${pendingCount} laporan dalam antrean siap disinkronisasi.`}
          </span>
        </div>
      </div>

      {isOnline && pendingCount > 0 && (
        <button
          type="button"
          disabled={isSyncing}
          onClick={triggerSync}
          className="px-2.5 py-1 rounded-lg bg-[#155E38] text-white text-[11px] font-bold hover:bg-[#0F4A2C] active:scale-95 transition-all flex items-center gap-1 flex-shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sinkron...' : 'Kirim'}</span>
        </button>
      )}
    </div>
  )
}
