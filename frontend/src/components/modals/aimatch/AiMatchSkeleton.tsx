import React from 'react'

export const AiMatchSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse" aria-hidden="true">
      {/* Hero Match Card Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3.5 text-left">
        {/* Header Pill */}
        <div className="flex items-center justify-between">
          <div className="w-40 h-6 rounded-full bg-slate-200/90" />
          <div className="w-14 h-3 rounded bg-slate-100" />
        </div>

        {/* 2-Column Photo Comparison Skeleton */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="aspect-4/3 rounded-xl bg-slate-200/80" />
            <div className="w-3/4 h-3 rounded bg-slate-100" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="aspect-4/3 rounded-xl bg-slate-200/90" />
            <div className="w-4/5 h-3 rounded bg-slate-200" />
          </div>
        </div>

        {/* Pos Satpam Info Placeholder */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
          <div className="w-48 h-3.5 rounded bg-slate-200/80" />
          <div className="w-36 h-3 rounded bg-slate-100" />
        </div>

        {/* AI Evidence Bullet Points */}
        <div className="flex flex-col gap-2">
          <div className="w-32 h-3 rounded bg-slate-200" />
          <div className="w-full h-3 rounded bg-slate-100" />
          <div className="w-5/6 h-3 rounded bg-slate-100" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
          <div className="w-full h-10 rounded-xl bg-slate-200/90" />
          <div className="w-full h-8 rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Alternative Matches Section Skeleton */}
      <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
        <div className="w-44 h-3.5 rounded bg-slate-200" />
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-slate-200/80 flex-shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-32 h-3.5 rounded bg-slate-200" />
                  <div className="w-24 h-2.5 rounded bg-slate-100" />
                </div>
              </div>
              <div className="w-12 h-5 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
