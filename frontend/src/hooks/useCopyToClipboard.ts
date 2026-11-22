import { useState, useCallback, useRef, useEffect } from 'react'

export interface CopyToClipboardResult {
  copied: boolean
  copyFailed: boolean
  copy: (text: string) => Promise<boolean>
}

/**
 * Modern Web Guidance compliant clipboard hook
 * - Uses Async Clipboard API with proper try/catch and secure context detection
 * - Provides synchronous fallback (document.execCommand) for unsupported contexts
 * - Cleans up active timeouts on unmount and subsequent copy triggers
 * - Exposes copyFailed state so assistive tech and UI can communicate errors
 */
export function useCopyToClipboard(resetDelayMs = 2000): CopyToClipboardResult {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      const scheduleReset = () => {
        timeoutRef.current = window.setTimeout(() => {
          setCopied(false)
          setCopyFailed(false)
        }, resetDelayMs)
      }

      try {
        if (typeof window !== 'undefined' && window.isSecureContext && navigator.clipboard) {
          await navigator.clipboard.writeText(text)
        } else {
          // Fallback legacy copy for unsecure contexts or embedded webviews
          const textarea = Object.assign(document.createElement('textarea'), { value: text })
          textarea.setAttribute('readonly', '')
          textarea.style.cssText = 'position:fixed;inset-block-start:0;opacity:0;pointer-events:none;'
          document.body.append(textarea)
          textarea.select()
          try {
            const success = document.execCommand('copy')
            if (!success) throw new Error('Legacy copy command returned false')
          } finally {
            textarea.remove()
          }
        }

        setCopied(true)
        setCopyFailed(false)
        scheduleReset()
        return true
      } catch {
        setCopied(false)
        setCopyFailed(true)
        scheduleReset()
        return false
      }
    },
    [resetDelayMs]
  )

  return { copied, copyFailed, copy }
}
