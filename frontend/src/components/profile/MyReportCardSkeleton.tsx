import React from 'react'

interface MyReportCardSkeletonProps {
  count?: number
}

export const MyReportCardSkeleton: React.FC<MyReportCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat daftar laporan"
      className="rounded-xl bg-white border border-slate-200 divide-y divide-slate-200 overflow-hidden animate-pulse"
    >
      <span className="sr-only">Memuat riwayat laporan Anda...</span>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="px-3.5 py-3.5 flex flex-col gap-2.5 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0" />
            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-3 rounded bg-slate-200" />
                <div className="w-16 h-3 rounded bg-slate-100" />
              </div>
              <div className="w-3/4 h-3.5 rounded bg-slate-200" />
              <div className="w-1/2 h-3 rounded bg-slate-100" />
            </div>
          </div>
          <div className="pl-15 flex items-center justify-between">
            <div className="w-28 h-3.5 rounded bg-slate-100" />
            <div className="w-24 h-7 rounded-lg bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
