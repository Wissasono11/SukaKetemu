import { useState } from 'react'
import BerandaUtama from './pages/BerandaUtama'
import LaporBarang, { type InitialReportLocation } from './pages/LaporBarang'
import type { ReportType } from './types/lostFound'

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
      <LaporBarang
        key={`${reportType}-${initialLocation?.ruangan ?? ''}-${initialLocation?.posSatpam ?? ''}`}
        reportType={reportType}
        initialLocation={initialLocation}
        onBack={handleBackToBeranda}
        onSuccess={handleBackToBeranda}
      />
    )
  }

  return <BerandaUtama onNavigateToLapor={handleNavigateToLapor} />
}

export default App
