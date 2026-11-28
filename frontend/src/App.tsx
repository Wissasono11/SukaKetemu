import { useState, lazy, Suspense } from 'react'
import { Toaster } from 'sileo'
import BerandaUtama from './pages/BerandaUtama'
import type { InitialReportLocation } from './pages/LaporBarang'
import type { ReportType } from './types/lostFound'

const LaporBarang = lazy(() => import('./pages/LaporBarang'))

function App() {
  const [currentPage, setCurrentPage] = useState<'beranda' | 'lapor'>('beranda')
  const [reportType, setReportType] = useState<ReportType>('lost')
  const [initialLocation, setInitialLocation] = useState<InitialReportLocation | undefined>(undefined)

  const handleNavigateToLapor = (
    type: ReportType = 'lost',
    location?: InitialReportLocation
  ) => {
    setReportType(type)
    setInitialLocation(location)
    setCurrentPage('lapor')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToBeranda = () => {
    setCurrentPage('beranda')
    setInitialLocation(undefined)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Toaster
        position="top-center"
        offset={{ top: 12 }}
        options={{
          fill: '#14261B',
          roundness: 16,
          duration: 3500,
          autopilot: { expand: 50, collapse: 2900 },
          styles: {
            title: 'font-semibold',
            description: 'text-slate-200 text-xs leading-relaxed',
            button: 'font-bold',
          },
        }}
      />
      {currentPage === 'lapor' ? (
        <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
          <LaporBarang
            key={`${reportType}-${initialLocation?.ruangan ?? ''}-${initialLocation?.posSatpam ?? ''}`}
            reportType={reportType}
            initialLocation={initialLocation}
            onBack={handleBackToBeranda}
            onSuccess={handleBackToBeranda}
          />
        </Suspense>
      ) : (
        <BerandaUtama onNavigateToLapor={handleNavigateToLapor} />
      )}
    </>
  )
}

export default App
