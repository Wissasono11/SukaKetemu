import React from 'react'

interface PosSatpamCardSkeletonProps {
  count?: number
}

export const PosSatpamCardSkeleton: React.FC<PosSatpamCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="flex flex-col gap-3.5 animate-pulse" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <article
          key={i}
          className="rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col overflow-hidden text-left"
        >
          {/* Header */}
          <div className="p-4 pb-3 flex items-start justify-between border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-200/80 flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="w-36 h-3.5 rounded bg-slate-200" />
                <div className="w-24 h-2.5 rounded bg-slate-100" />
              </div>
            </div>
            <div className="w-16 h-5 rounded-full bg-slate-200" />
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-2.5">
            <div className="w-3/4 h-3 rounded bg-slate-100" />
            <div className="w-1/2 h-3 rounded bg-slate-100" />
            <div className="w-2/3 h-3 rounded bg-slate-100" />

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <div className="flex-1 h-8 rounded-xl bg-slate-200/70" />
              <div className="flex-1 h-8 rounded-xl bg-slate-200/70" />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
