import React from 'react'
import {
  X,
  Radar,
  ShieldCheck,
  Bell,
  CheckCheck,
  ChevronRight,
} from 'lucide-react'

export interface AppNotification {
  id: string
  type: 'aimatch' | 'claim' | 'system'
  title: string
  message: string
  timeAgo: string
  isRead: boolean
  actionLabel?: string
  actionTarget?: 'aimatch' | 'claim'
}

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  notifications: AppNotification[]
  onMarkAllAsRead: () => void
  onSelectNotification: (item: AppNotification) => void
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const renderIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'aimatch':
        return (
          <div className="w-8 h-8 rounded-full bg-[#E4F1E8] text-[#155E38] flex items-center justify-center flex-shrink-0">
            <Radar className="w-4 h-4" />
          </div>
        )
      case 'claim':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        )
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 text-left">
        {/* Header Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#14261B]">Notifikasi</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#155E38] text-white text-[10px] font-bold">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-xs font-semibold text-[#155E38] hover:text-[#0F4A2C] px-2 py-1 rounded-md transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai Dibaca</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup notifikasi"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Notifikasi */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {notifications.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#14261B]">Belum Ada Notifikasi</p>
              <p className="text-xs text-[#44574B] mt-1 max-w-xs">
                Pembaruan seputar kecocokan radar AI dan status klaim pos satpam akan muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectNotification(item)
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 text-left active:scale-[0.99] ${
                  item.isRead
                    ? 'bg-white border-slate-200/70 hover:bg-slate-50'
                    : 'bg-[#E4F1E8]/30 border-[#155E38]/20 hover:bg-[#E4F1E8]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {renderIcon(item.type)}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#14261B] truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#44574B]">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>

                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#155E38] flex-shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-[11px] text-[#44574B] leading-relaxed pl-10">
                  {item.message}
                </p>

                {item.actionLabel && (
                  <div className="pl-10 pt-1 flex items-center gap-1 text-[11px] font-bold text-[#155E38]">
                    <span>{item.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
