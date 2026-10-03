import { ApiError, api, getAccessToken, refreshSession } from './api'

// Image uploads go to the Express API (POST /api/upload, stored on the
// server and served from /uploads). The file keeps its historical name so
// every component importing it is unchanged.

const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

async function token() {
  return getAccessToken() || (await refreshSession()).accessToken
}

function send(file, folder, onProgress, accessToken) {
  const formData = new FormData()
  formData.append('folder', folder)
  formData.append('file', file)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API}/upload`)
    xhr.withCredentials = true
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      let data = null
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        data = null
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data)
      else reject(new ApiError(xhr.status, data?.error?.code || `http-${xhr.status}`, data?.error?.message || 'Upload failed.'))
    }
    xhr.onerror = () => reject(new ApiError(0, 'network-error', 'Upload failed: network error'))
    xhr.send(formData)
  })
}

/**
 * Uploads an image to the server. Returns { url, publicId, width, height }.
 */
export async function uploadImage(file, { folder = 'lumen-ledger', onProgress } = {}) {
  let data
  try {
    data = await send(file, folder, onProgress, await token())
  } catch (err) {
    if (err.status !== 401) throw err
    // Access token expired: refresh once and retry.
    data = await send(file, folder, onProgress, (await refreshSession()).accessToken)
  }

  return {
    url: data.url,
    publicId: data.publicId,
    width: data.width,
    height: data.height,
  }
}

/**
 * Returns an optimized delivery URL for a Cloudinary image — auto format/quality
 * and a max width, so cards and hero images never ship an oversized original.
 * Images uploaded to this server (/uploads/…) are returned unchanged.
 */
export function optimizedUrl(url, { width } = {}) {
  if (!url || !url.includes('/upload/')) return url
  const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto'
  return url.replace('/upload/', `/upload/${transform}/`)
}

/** Deletes an uploaded image by the publicId uploadImage returned. */
export async function deleteImage(publicId) {
  await api.delete(`/upload/${encodeURIComponent(publicId)}`)
}
