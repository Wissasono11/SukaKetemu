import { useState, useCallback } from 'react'

export function useCopyToClipboard(resetDelayMs = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    (text: string) => {
      if (!navigator.clipboard) return false
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), resetDelayMs)
      return true
    },
    [resetDelayMs]
  )

  return { copied, copy }
}
