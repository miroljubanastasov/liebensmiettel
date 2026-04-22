/**
 * Panorama-style receipt strip stitcher.
 *
 * Receipts are 1-D (tall, narrow, high contrast). We exploit that: compute a
 * 1-D vertical brightness profile of each frame and use normalised cross-
 * correlation against the previous frame's profile to estimate how far the
 * user moved the camera between frames. Only the newly-revealed rows are
 * appended to the output canvas.
 *
 * Pure browser implementation — no OpenCV.js. Runs in well under a frame on
 * mid-range phones (~H multiplications per dy candidate).
 *
 * Exports:
 *   computeProfile(imageData)            pure helper, testable in Node
 *   estimateDy(prev, curr, opts)         pure helper, testable in Node
 *   createStripStitcher({frameWidth,frameHeight,maxHeight})
 */

/**
 * Compute a 1-D vertical luma profile: one value per row, averaged over the
 * centre `centerRatio` of the frame width. The centre strip is where the
 * text is when the user keeps the receipt aligned with the guide.
 */
export function computeProfile(imageData, { centerRatio = 0.6 } = {}) {
    const { data, width, height } = imageData
    const x0 = Math.max(0, Math.floor((width * (1 - centerRatio)) / 2))
    const x1 = Math.min(width, Math.floor((width * (1 + centerRatio)) / 2))
    const span = Math.max(1, x1 - x0)
    const profile = new Float32Array(height)
    for (let y = 0; y < height; y++) {
        const base = y * width * 4
        let sum = 0
        for (let x = x0; x < x1; x++) {
            const i = base + x * 4
            sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        }
        profile[y] = sum / span
    }
    return profile
}

/**
 * Normalised cross-correlation between two equal-length slices
 * a[ai..ai+n) and b[bi..bi+n). Returns in [-1, 1].
 */
function ncc(a, ai, b, bi, n) {
    let sa = 0, sb = 0, sa2 = 0, sb2 = 0, sab = 0
    for (let i = 0; i < n; i++) {
        const x = a[ai + i]
        const y = b[bi + i]
        sa += x; sb += y
        sa2 += x * x; sb2 += y * y
        sab += x * y
    }
    const na = n * sa2 - sa * sa
    const nb = n * sb2 - sb * sb
    const denom = Math.sqrt(Math.max(0, na) * Math.max(0, nb))
    if (denom < 1e-6) return 0
    return (n * sab - sa * sb) / denom
}

/**
 * Estimate how far (in pixels) the camera moved *downward* between the
 * previous frame and the current frame.
 *
 * We search for the dy that maximises correlation between
 * prev[0 .. H-dy) and curr[dy .. H).
 *
 * Returns { dy, score } where score in [-1,1]. Only dy > 0 is considered
 * (we don't handle reverse motion).
 */
export function estimateDy(prev, curr, {
    minDy = 4,
    maxDy = null,
    minOverlap = 64,
    step = 1,
} = {}) {
    const H = Math.min(prev.length, curr.length)
    const maxD = maxDy ?? Math.floor(H * 0.7)
    let best = { dy: 0, score: -2 }
    for (let dy = minDy; dy <= maxD; dy += step) {
        const n = H - dy
        if (n < minOverlap) break
        const s = ncc(prev, 0, curr, dy, n)
        if (s > best.score) best = { dy, score: s }
    }
    return best
}

// Reason codes returned by stitcher.pushFrame when a frame is rejected.
export const REJECT = Object.freeze({
    LOW_CONFIDENCE: 'low_confidence',
    NO_MOTION: 'no_motion',
    TOO_FAST: 'too_fast',
    FULL: 'full',
})

/**
 * Create a stitcher. Draws into an internal HTMLCanvasElement.
 *
 * @param {object} opts
 * @param {number} opts.frameWidth    - width in px of each pushed frame
 * @param {number} opts.frameHeight   - height in px of each pushed frame
 * @param {number} [opts.maxHeight]   - output canvas hard cap
 * @param {number} [opts.minScore]    - min NCC to accept a frame (0.55)
 * @param {number} [opts.maxDyRatio]  - reject motion > this * frameHeight (0.7)
 */
export function createStripStitcher({
    frameWidth,
    frameHeight,
    maxHeight = 16000,
    minScore = 0.55,
    maxDyRatio = 0.7,
} = {}) {
    if (!frameWidth || !frameHeight) {
        throw new Error('createStripStitcher: frameWidth and frameHeight required')
    }

    const out = document.createElement('canvas')
    out.width = frameWidth
    out.height = maxHeight
    const outCtx = out.getContext('2d')
    outCtx.fillStyle = '#ffffff'
    outCtx.fillRect(0, 0, out.width, out.height)

    let prevProfile = null
    let cursorY = 0
    let framesAccepted = 0
    let lastScore = 0
    let lastDy = 0

    /**
     * @param {HTMLCanvasElement | OffscreenCanvas} srcCanvas
     *        a canvas that already contains the current video frame at
     *        (frameWidth × frameHeight).
     */
    function pushFrame(srcCanvas) {
        const sctx = srcCanvas.getContext('2d', { willReadFrequently: true })
        const imageData = sctx.getImageData(0, 0, frameWidth, frameHeight)
        const profile = computeProfile(imageData)

        if (!prevProfile) {
            outCtx.drawImage(srcCanvas, 0, 0)
            cursorY = frameHeight
            prevProfile = profile
            framesAccepted = 1
            lastScore = 1
            lastDy = frameHeight
            return { accepted: true, first: true, dy: frameHeight, score: 1 }
        }

        const maxDy = Math.floor(frameHeight * maxDyRatio)
        const { dy, score } = estimateDy(prevProfile, profile, { maxDy })
        lastScore = score
        lastDy = dy

        if (score < minScore) {
            return { accepted: false, reason: REJECT.LOW_CONFIDENCE, dy, score }
        }
        if (dy < 4) {
            return { accepted: false, reason: REJECT.NO_MOTION, dy, score }
        }
        if (dy >= maxDy) {
            return { accepted: false, reason: REJECT.TOO_FAST, dy, score }
        }
        if (cursorY + dy > maxHeight) {
            return { accepted: false, reason: REJECT.FULL, dy, score }
        }

        // Blit the newly-revealed strip (rows [H-dy, H)) at cursorY.
        outCtx.drawImage(
            srcCanvas,
            0, frameHeight - dy, frameWidth, dy,
            0, cursorY, frameWidth, dy,
        )
        cursorY += dy
        prevProfile = profile
        framesAccepted++
        return { accepted: true, dy, score }
    }

    async function finalize({ mime = 'image/jpeg', quality = 0.9 } = {}) {
        const cropped = document.createElement('canvas')
        cropped.width = frameWidth
        cropped.height = Math.max(1, cursorY)
        cropped.getContext('2d').drawImage(out, 0, 0)
        const blob = await new Promise((resolve) =>
            cropped.toBlob((b) => resolve(b), mime, quality),
        )
        // Release memory
        out.width = 0; out.height = 0
        cropped.width = 0; cropped.height = 0
        return blob
    }

    return {
        pushFrame,
        finalize,
        get framesAccepted() { return framesAccepted },
        get stitchedHeight() { return cursorY },
        get progress() { return Math.min(1, cursorY / maxHeight) },
        get lastScore() { return lastScore },
        get lastDy() { return lastDy },
    }
}
