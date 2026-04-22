import { useRef, useState } from 'react'
import { IconButton, Tooltip, CircularProgress } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

/**
 * Tiny camera/file-picker button that runs a user-provided OCR function
 * on the captured image and passes the result to onResult.
 *
 * On mobile, `capture="environment"` opens the back camera directly; on
 * desktop browsers it falls back to the file chooser.
 *
 * @param {object} props
 * @param {(file: File) => Promise<any>} props.onCapture - OCR extractor; returns parsed value
 * @param {(value: any) => void}         props.onResult  - receives OCR result
 * @param {string}  [props.tooltip='Photograph']
 * @param {'small'|'medium'|'large'} [props.size='small']
 * @param {boolean} [props.disabled]
 */
export default function PhotoCaptureButton({
    onCapture,
    onResult,
    tooltip = 'Photograph',
    size = 'small',
    disabled = false,
}) {
    const inputRef = useRef(null)
    const [busy, setBusy] = useState(false)

    const handleFile = async (e) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return
        setBusy(true)
        try {
            const result = await onCapture(file)
            onResult?.(result)
        } catch (err) {
            console.error('[PhotoCaptureButton]', err)
            onResult?.(null)
        } finally {
            setBusy(false)
        }
    }

    return (
        <Tooltip title={tooltip}>
            <span>
                <IconButton
                    size={size}
                    disabled={disabled || busy}
                    onClick={() => inputRef.current?.click()}
                >
                    {busy ? <CircularProgress size={18} /> : <CameraAltIcon fontSize="inherit" />}
                </IconButton>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                    style={{ display: 'none' }}
                />
            </span>
        </Tooltip>
    )
}
