import cloudinary from '../lib/cloudinary'

export async function uploadCVToCloudinary(
  buffer: Buffer,
  userId: string,
  originalName: string
): Promise<{ url: string; publicId: string }> {
  const ext       = originalName.split('.').pop()?.toLowerCase() || 'pdf'
  const publicId  = `cv_${userId}_${Date.now()}`
  const folder    = 'jobpilot/cvs'

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id:     publicId,
        resource_type: 'raw', // for PDF/DOCX files
        format:        ext,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'))
        } else {
          resolve({ url: result.secure_url, publicId: result.public_id })
        }
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteCVFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
  } catch (e) {
    console.error('Failed to delete CV from Cloudinary:', e)
  }
}

// Generate professional filename for job applications
export function getProfessionalCVName(firstName: string, lastName: string): string {
  const first = firstName?.trim().replace(/\s+/g, '') || 'Candidate'
  const last  = lastName?.trim().replace(/\s+/g, '')  || ''
  return last ? `${first}_${last}_CV.pdf` : `${first}_CV.pdf`
}