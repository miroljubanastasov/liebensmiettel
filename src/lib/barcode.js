/**
 * Live barcode scanning via @zxing/browser.
 */
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'

const FORMATS = [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.ITF,
]

function makeReader() {
    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, FORMATS)
    hints.set(DecodeHintType.TRY_HARDER, true)
    return new BrowserMultiFormatReader(hints)
}

/** Enumerate video input devices. Labels may be empty until permission granted. */
export async function listCameras() {
    try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        return devices.map((d, i) => ({
            deviceId: d.deviceId,
            label: d.label || `Camera ${i + 1}`,
        }))
    } catch {
        return []
    }
}

/** Heuristic back-camera picker. */
export function pickBackCamera(cameras) {
    if (!cameras?.length) return null
    const re = /back|rear|environment|r(?:ü|ue)ck/i
    const byLabel = cameras.find((c) => re.test(c.label))
    return byLabel ?? cameras[cameras.length - 1]
}

/** Trigger the permission prompt so enumerateDevices returns labels. */
export async function requestCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
        })
        stream.getTracks().forEach((t) => t.stop())
        return true
    } catch {
        return false
    }
}

/**
 * Start live scanning from a specific camera (or best-guess back camera).
 * Ensures mobile autoplay attributes are set.
 *
 * @param {HTMLVideoElement} videoEl
 * @param {(code: string) => void} onDecode
 * @param {string} [deviceId]
 * @returns {{ stop: () => void }}
 */
export async function startScanning(videoEl, onDecode, deviceId) {
    if (!videoEl) throw new Error('No video element')

    const reader = makeReader()
    let stopped = false

    let targetId = deviceId
    if (!targetId) {
        let cams = await listCameras()
        if (!cams.length || !cams[0].label) {
            await requestCameraPermission()
            cams = await listCameras()
        }
        targetId = pickBackCamera(cams)?.deviceId
    }

    videoEl.setAttribute('autoplay', '')
    videoEl.setAttribute('muted', '')
    videoEl.setAttribute('playsinline', '')

    const controls = await reader.decodeFromVideoDevice(
        targetId ?? null,
        videoEl,
        (result) => {
            if (stopped || !result) return
            const text = result.getText?.() ?? String(result)
            if (text) onDecode(text)
        },
    )

    try { await videoEl.play() } catch { /* ignore */ }

    return {
        stop() {
            stopped = true
            try { controls?.stop() } catch { /* ignore */ }
        },
    }
}

/** One-shot decode from a still image. */
export async function decodeImage(imageOrUrl) {
    const reader = makeReader()
    let url = imageOrUrl
    let revoke = false
    try {
        if (imageOrUrl instanceof Blob) {
            url = URL.createObjectURL(imageOrUrl)
            revoke = true
        }
        const result = await reader.decodeFromImageUrl(url)
        return result?.getText?.() ?? null
    } catch {
        return null
    } finally {
        if (revoke) URL.revokeObjectURL(url)
    }
}
