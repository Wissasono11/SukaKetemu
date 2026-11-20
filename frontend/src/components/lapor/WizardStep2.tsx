import React from 'react'
import {
  Edit3,
  ArrowRight,
  Laptop,
  CreditCard,
  Briefcase,
  CupSoda,
  Moon,
  Shapes,
} from 'lucide-react'

interface WizardStep2Props {
  isFound: boolean
  category: string
  onCategoryChange: (cat: string) => void
  title: string
  onTitleChange: (val: string) => void
  description: string
  onDescriptionChange: (val: string) => void
  onPrev: () => void
  onNext: () => void
}

const CATEGORIES = [
  { id: 'elektronik', label: 'Elektronik', icon: Laptop },
  { id: 'dokumen', label: 'KTM / Dokumen', icon: CreditCard },
  { id: 'tas', label: 'Tas / Dompet', icon: Briefcase },
  { id: 'botol', label: 'Botol Minum', icon: CupSoda },
  { id: 'ibadah', label: 'Alat Ibadah', icon: Moon },
  { id: 'lainnya', label: 'Lainnya', icon: Shapes },
]

export const WizardStep2: React.FC<WizardStep2Props> = ({
  isFound,
  category,
  onCategoryChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      <div className="flex flex-col gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
            <Edit3 className="w-4 h-4 text-[#155E38]" />
            Pilih Kategori Barang
          </span>
          <span className="text-[10px] font-bold text-[#0F4A2C] bg-[#E4F1E8] px-2 py-0.5 rounded-full">
            Wajib
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = category === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-[#155E38] text-white shadow-sm'
                    : 'bg-slate-50 text-[#14261B] hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-[#44574B]'}`} />
                <span className="text-[11px] font-bold leading-tight">{cat.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <label htmlFor="item-title" className="text-xs font-bold text-[#14261B]">
            Nama &amp; Merek Barang
          </label>
          <input
            id="item-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Contoh: Kalkulator Casio FX-991EX Abu-abu"
            className="w-full bg-slate-50 text-[#14261B] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#155E38]/20 border border-slate-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="item-desc" className="text-xs font-bold text-[#14261B]">
            Deskripsi Ciri Tampak Luar
          </label>
          <textarea
            id="item-desc"
            rows={3}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Sebutkan warna, ada casing, gantungan, atau goresan yang terlihat..."
            className="w-full bg-slate-50 text-[#14261B] rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#155E38]/20 border border-slate-200 resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          type="button"
          onClick={onPrev}
          className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#14261B] text-xs font-bold"
        >
          Kembali
        </button>
        <button
          type="button"
          onClick={onNext}
          className="py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
        >
          <span>{isFound ? 'Lanjut ke Kustodi' : 'Lanjut ke Validasi'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
