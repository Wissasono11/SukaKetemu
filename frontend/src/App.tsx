import { useState, lazy, Suspense } from 'react'
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

  if (currentPage === 'lapor') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
        <LaporBarang
          key={`${reportType}-${initialLocation?.ruangan ?? ''}-${initialLocation?.posSatpam ?? ''}`}
          reportType={reportType}
          initialLocation={initialLocation}
          onBack={handleBackToBeranda}
          onSuccess={handleBackToBeranda}
        />
      </Suspense>
    )
  }

  return <BerandaUtama onNavigateToLapor={handleNavigateToLapor} />
}

export default App
