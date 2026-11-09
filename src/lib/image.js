// Ajuste automático de fotos en el navegador antes de subirlas:
// recorta al centro con la proporción indicada, reduce el tamaño y convierte a WebP.
// Así cualquier foto (aunque pese 10 MB) queda uniforme y ligera.

export const IMAGE_PRESETS = {
  product: { width: 800, height: 800 }, // cuadrada, tarjetas de producto
  hero: { width: 1600, height: 900 }, // 16:9, portada
  about: { width: 1200, height: 900 }, // 4:3, sección "nuestra tradición"
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen. Usa JPG, PNG o WebP.'))
    }
    img.src = url
  })
}

export async function resizeImage(file, { width, height }, quality = 0.82) {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen.')
  const img = await loadImage(file)

  // Recorte tipo "cover": llena el lienzo sin deformar.
  const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
  const sw = width / scale
  const sh = height / scale
  const sx = (img.naturalWidth - sw) / 2
  const sy = (img.naturalHeight - sh) / 2

  // No agrandar fotos pequeñas: si la original es menor, se usa su tamaño.
  const factor = Math.min(1, img.naturalWidth / width, img.naturalHeight / height)
  const outW = Math.round(width * Math.max(factor, 0.25))
  const outH = Math.round(height * Math.max(factor, 0.25))

  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  if (!blob) throw new Error('Tu navegador no pudo convertir la imagen.')
  return blob
}

export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
