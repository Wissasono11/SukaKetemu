import React from 'react'

interface ClaimHistorySkeletonProps {
  count?: number
}

export const ClaimHistorySkeleton: React.FC<ClaimHistorySkeletonProps> = ({ count = 2 }) => {
  return (
    <div className="flex flex-col gap-3 animate-pulse" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-2 shadow-2xs text-left"
        >
          <div className="flex items-center justify-between">
            <div className="w-24 h-3 rounded bg-slate-200" />
            <div className="w-16 h-4 rounded-full bg-slate-100" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200/80 flex-shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="w-3/5 h-3.5 rounded bg-slate-200" />
              <div className="w-2/5 h-3 rounded bg-slate-100" />
              <div className="w-1/4 h-2.5 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
