import React, { useState } from 'react'
import type { ReportType } from '../types/lostFound'
import { LaporHeader } from '../components/lapor/LaporHeader'
import { OfflineStatusBanner } from '../components/common/OfflineStatusBanner'
import { LaporStepper } from '../components/lapor/LaporStepper'
import { WizardStep1 } from '../components/lapor/WizardStep1'
import { WizardStep2 } from '../components/lapor/WizardStep2'
import { WizardStep3 } from '../components/lapor/WizardStep3'
import { submitReport } from '../services/reportService'
import { enqueueOfflineReport } from '../services/offlineSyncService'
import { addMyReportFromSubmission } from '../services/userDataService'

export interface InitialReportLocation {
  gedung?: string
  lantai?: string
  ruangan?: string
  posSatpam?: string
}

interface LaporBarangProps {
  reportType: ReportType
  initialLocation?: InitialReportLocation
  onBack: () => void
  onSuccess?: () => void
}

export const LaporBarang: React.FC<LaporBarangProps> = ({
  reportType,
  initialLocation,
  onBack,
  onSuccess,
}) => {
  const isFound = reportType === 'found'
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 State
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [hasRefPhoto, setHasRefPhoto] = useState(false)
  const [isPrivacyBlur, setIsPrivacyBlur] = useState(true)
  const [timeLost, setTimeLost] = useState('')
  const [gedung, setGedung] = useState(initialLocation?.gedung || 'FST (Saintek)')
  const [lantai, setLantai] = useState(initialLocation?.lantai || 'Lantai 1')
  const [ruangan, setRuangan] = useState(
    initialLocation?.ruangan || (isFound ? 'Pos Satpam' : 'Lobby')
  )
  const [qrCheckpointCode, setQrCheckpointCode] = useState<string | undefined>(undefined)

  // Step 2 State
  const [category, setCategory] = useState('elektronik')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Step 3 State
  const [custodyStatus, setCustodyStatus] = useState<'satpam' | 'penemu'>('satpam')
  const [posSatpam, setPosSatpam] = useState(
    initialLocation?.posSatpam || 'Pos Satpam Utama Lobby FST'
  )
  const [secretFeature, setSecretFeature] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isOfflineSaved, setIsOfflineSaved] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (title.trim().length < 3) {
      setSubmitError('Nama & merek barang minimal 3 karakter.')
      setCurrentStep(2)
      return
    }
    if (!isFound && secretFeature.trim().length < 5) {
      setSubmitError('Ciri rahasia pemilik wajib diisi minimal 5 karakter.')
      return
    }
    if (isFound && custodyStatus === 'penemu' && contactPhone.trim().length < 8) {
      setSubmitError('Masukkan nomor WhatsApp penemu agar pemilik dapat menghubungi setelah verifikasi.')
      return
    }

    setIsSubmitting(true)
    const reportPayload = {
      type: reportType,
      title: title.trim(),
      category,
      description: description.trim(),
      location: { gedung, lantai, ruangan },
      qrCheckpointCode,
      custody: (custodyStatus === 'satpam' ? 'pos_satpam' : 'dibawa_penemu') as 'pos_satpam' | 'dibawa_penemu',
      posId: custodyStatus === 'satpam' ? posSatpam : undefined,
      secretFeature: secretFeature.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      timeLost: isFound ? undefined : timeLost.trim() || undefined,
      photoFile,
      isPrivacyBlur,
    }

    try {
      if (!navigator.onLine) {
        // Safe offline queue via Dexie.js (IndexedDB)
        const offlineId = await enqueueOfflineReport(reportPayload)
        await addMyReportFromSubmission(reportPayload, `OFFLINE-${offlineId}`)
        setIsOfflineSaved(true)
        setIsSuccess(true)
      } else {
        const res = await submitReport(reportPayload)
        await addMyReportFromSubmission(reportPayload, res.id)
        setIsOfflineSaved(false)
        setIsSuccess(true)
      }
      setTimeout(() => {
        if (onSuccess) onSuccess()
        else onBack()
      }, 1500)
    } catch (err) {
      console.warn('Network submit failed, enqueueing to IndexedDB offline storage:', err)
      try {
        const offlineId = await enqueueOfflineReport(reportPayload)
        await addMyReportFromSubmission(reportPayload, `OFFLINE-${offlineId}`)
        setIsOfflineSaved(true)
        setIsSuccess(true)
        setTimeout(() => {
          if (onSuccess) onSuccess()
          else onBack()
        }, 1500)
      } catch (dbErr) {
        console.error('Fatal Dexie error:', dbErr)
        alert('Gagal menyimpan laporan. Silakan coba lagi.')
      }
    } finally {
      setIsSubmitting(false)
    }
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
        <OfflineStatusBanner />

        <LaporStepper steps={steps} currentStep={currentStep} />

        {submitError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-[#B3261E]"
          >
            {submitError}
          </div>
        )}

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
              onQrCheckpointChange={setQrCheckpointCode}
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
              isOfflineSaved={isOfflineSaved}
              onPrev={() => setCurrentStep(2)}
            />
          )}
        </form>
      </div>
    </div>
  )
}

export default LaporBarang
