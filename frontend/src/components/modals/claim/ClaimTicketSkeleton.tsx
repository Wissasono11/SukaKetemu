import React from 'react'

export const ClaimTicketSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 animate-pulse" aria-hidden="true">
      {/* Boarding Pass Ticket Silhouette */}
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Upper Ticket Section */}
        <div className="p-4 flex flex-col gap-3 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="w-20 h-4 rounded-md bg-slate-200/80" />
            <div className="w-24 h-4.5 rounded-full bg-slate-200/80" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-slate-200/90 flex-shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="w-3/4 h-4 rounded-md bg-slate-200/90" />
              <div className="w-1/2 h-3 rounded-md bg-slate-100" />
              <div className="w-2/5 h-2.5 rounded-md bg-slate-100" />
            </div>
          </div>
        </div>

        {/* Perforated Tear Line */}
        <div className="relative flex items-center justify-between px-2 py-1 bg-white">
          <div className="w-3 h-6 rounded-r-full bg-slate-100 border-r border-slate-200 -ml-2" />
          <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2" />
          <div className="w-3 h-6 rounded-l-full bg-slate-100 border-l border-slate-200 -mr-2" />
        </div>

        {/* Lower Ticket Section (QR & OTP Placeholder) */}
        <div className="p-4 pt-2 flex flex-col items-center text-center gap-3 bg-white">
          {/* QR Box Silhouette */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center">
            <div className="w-28 h-28 bg-slate-200/90 rounded-lg" />
            <div className="w-24 h-2.5 rounded bg-slate-100 mt-2" />
          </div>

          {/* OTP Code Silhouette (6-Digit & TTL Badge) */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            <div className="flex items-center justify-between w-full px-1">
              <div className="w-36 h-2.5 rounded bg-slate-100" />
              <div className="w-16 h-3.5 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-44 h-9 rounded-xl bg-slate-200/80" />
              <div className="w-9 h-9 rounded-xl bg-slate-100" />
            </div>
          </div>

          {/* Security Instruction Box Silhouette */}
          <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-100" />
        </div>

        {/* Action Button Row Silhouette */}
        <div className="p-4 pt-0 flex items-center gap-2">
          <div className="flex-1 h-9 rounded-xl bg-slate-200/70" />
          <div className="flex-1 h-9 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  )
}
