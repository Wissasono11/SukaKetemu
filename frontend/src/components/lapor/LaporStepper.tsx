import React from 'react'

interface StepItem {
  number: number
  title: string
}

interface LaporStepperProps {
  steps: StepItem[]
  currentStep: number
}

export const LaporStepper: React.FC<LaporStepperProps> = ({ steps, currentStep }) => {
  const progressPercent = currentStep === 1 ? '16%' : currentStep === 2 ? '50%' : '100%'

  return (
    <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
      <div className="flex items-center justify-between relative px-4">
        <div className="absolute left-9 right-9 top-3.5 h-0.5 bg-slate-100 -z-0" />
        <div
          className="absolute left-9 top-3.5 h-0.5 bg-[#155E38] -z-0 transition-all duration-300"
          style={{ width: `calc(${progressPercent} - 36px)` }}
        />
        {steps.map((s) => {
          const isActive = currentStep === s.number
          const isDone = currentStep > s.number
          return (
            <div key={s.number} className="flex flex-col items-center relative z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#155E38] text-white ring-2 ring-[#E4F1E8] shadow-sm'
                    : isDone
                    ? 'bg-[#0F4A2C] text-white'
                    : 'bg-slate-100 text-[#44574B]'
                }`}
              >
                {isDone ? '✓' : s.number}
              </div>
              <span
                className={`text-[10px] font-bold mt-1 ${
                  isActive ? 'text-[#155E38]' : 'text-[#44574B]'
                }`}
              >
                {s.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
