import React, { useState } from 'react'
import type { ReportType } from '../types/lostFound'
import { LaporHeader } from '../components/lapor/LaporHeader'
import { LaporStepper } from '../components/lapor/LaporStepper'
import { WizardStep1 } from '../components/lapor/WizardStep1'
import { WizardStep2 } from '../components/lapor/WizardStep2'
import { WizardStep3 } from '../components/lapor/WizardStep3'

interface LaporBarangProps {
  reportType: ReportType
  onBack: () => void
  onSuccess?: () => void
}

export const LaporBarang: React.FC<LaporBarangProps> = ({
  reportType,
  onBack,
  onSuccess,
}) => {
  const isFound = reportType === 'found'
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 State
  const [photoUrl, setPhotoUrl] = useState(
    isFound
      ? 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=600&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'
  )
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [hasRefPhoto, setHasRefPhoto] = useState(!isFound)
  const [isPrivacyBlur, setIsPrivacyBlur] = useState(true)
  const [timeLost, setTimeLost] = useState('Hari ini, ~14:15 WIB setelah kuliah')
  const [gedung, setGedung] = useState('FST (Saintek)')
  const [lantai, setLantai] = useState('Lantai 2')
  const [ruangan, setRuangan] = useState('Lab Terpadu 204')

  // Step 2 State
  const [category, setCategory] = useState('elektronik')
  const [title, setTitle] = useState(
    isFound
      ? 'Kalkulator Casio FX-991EX Abu-abu'
      : 'TWS Soundcore R50i Hitam'
  )
  const [description, setDescription] = useState(
    isFound
      ? 'Ditemukan di atas meja praktikum baris ketiga dekat jendela.'
      : 'Tertinggal kemungkinan di laci meja praktikum atau selasar FST.'
  )

  // Step 3 State
  const [custodyStatus, setCustodyStatus] = useState<'satpam' | 'penemu'>('satpam')
  const [posSatpam, setPosSatpam] = useState('Pos Satpam Utama FST (Lobby)')
  const [secretFeature, setSecretFeature] = useState(
    isFound
      ? 'Stiker kecil logo HIMATIF di dalam penutup baterai'
      : 'Stiker kecil logo anime di dalam tutup case earbud'
  )
  const [contactPhone, setContactPhone] = useState('0812-3456-7890')

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        else onBack()
      }, 1200)
    }, 900)
  }

  const steps = isFound
    ? [
        { number: 1, title: 'Foto & Titik' },
        { number: 2, title: 'Detail Barang' },
        { number: 3, title: 'Posisi Fisik' },
      ]
    : [
        { number: 1, title: 'Waktu & Rute' },
        { number: 2, title: 'Detail Barang' },
        { number: 3, title: 'Kuis Rahasia' },
      ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#14261B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center">
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.06)] px-4 py-4 gap-4">
        <LaporHeader
          isFound={isFound}
          onBack={currentStep > 1 ? () => setCurrentStep((prev) => prev - 1) : onBack}
          onClose={onBack}
        />

        <LaporStepper steps={steps} currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between gap-4">
          {currentStep === 1 && (
            <WizardStep1
              isFound={isFound}
              photoUrl={photoUrl}
              onPhotoChange={setPhotoUrl}
              photoFile={photoFile}
              onPhotoFileChange={setPhotoFile}
              hasRefPhoto={hasRefPhoto}
              onHasRefPhotoChange={setHasRefPhoto}
              isPrivacyBlur={isPrivacyBlur}
              onPrivacyBlurToggle={setIsPrivacyBlur}
              timeLost={timeLost}
              onTimeLostChange={setTimeLost}
              gedung={gedung}
              onGedungChange={setGedung}
              lantai={lantai}
              onLantaiChange={setLantai}
              ruangan={ruangan}
              onRuanganChange={setRuangan}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <WizardStep2
              isFound={isFound}
              category={category}
              onCategoryChange={setCategory}
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              onPrev={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <WizardStep3
              isFound={isFound}
              custodyStatus={custodyStatus}
              onCustodyChange={setCustodyStatus}
              posSatpam={posSatpam}
              onPosSatpamChange={setPosSatpam}
              secretFeature={secretFeature}
              onSecretFeatureChange={setSecretFeature}
              contactPhone={contactPhone}
              onContactPhoneChange={setContactPhone}
              isSubmitting={isSubmitting}
              isSuccess={isSuccess}
              onPrev={() => setCurrentStep(2)}
            />
          )}
        </form>
      </div>
    </div>
  )
}

export default LaporBarang
