import React from 'react'

interface NotificationSkeletonProps {
  count?: number
}

export const NotificationSkeleton: React.FC<NotificationSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="flex flex-col gap-2.5 animate-pulse" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3.5 rounded-2xl border border-slate-200/80 bg-white flex flex-col gap-2 text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-slate-200/80 flex-shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="w-3/4 h-3.5 rounded bg-slate-200" />
                <div className="w-1/3 h-2.5 rounded bg-slate-100" />
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-200 flex-shrink-0 mt-1" />
          </div>
          <div className="w-full h-3 rounded bg-slate-100 pl-10.5" />
        </div>
      ))}
    </div>
  )
}
