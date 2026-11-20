import { useState } from 'react'
import BerandaUtama from './pages/BerandaUtama'
import LaporBarang from './pages/LaporBarang'
import type { ReportType } from './types/lostFound'

function App() {
  const [currentPage, setCurrentPage] = useState<'beranda' | 'lapor'>('beranda')
  const [reportType, setReportType] = useState<ReportType>('lost')

  const handleNavigateToLapor = (type: ReportType = 'lost') => {
    setReportType(type)
    setCurrentPage('lapor')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToBeranda = () => {
    setCurrentPage('beranda')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentPage === 'lapor') {
    return (
      <LaporBarang
        reportType={reportType}
        onBack={handleBackToBeranda}
        onSuccess={handleBackToBeranda}
      />
    )
  }

  return <BerandaUtama onNavigateToLapor={handleNavigateToLapor} />
}

export default App
