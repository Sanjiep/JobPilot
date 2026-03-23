import { Router, Response } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload'
import { extractCVData } from '../services/cv.service'
import { uploadCVToCloudinary, deleteCVFromCloudinary } from '../services/file.service'
import prisma from '../lib/prisma'

const router = Router()

// POST /api/resume/upload
router.post('/upload', authMiddleware, upload.single('cv'), async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const { buffer, originalname, mimetype } = req.file
    const userId = req.user.id

    // 1. Extract data using AI
    const extractedData = await extractCVData(buffer, originalname, mimetype)

    // 2. Upload to Cloudinary
    let cvFileUrl  = null
    let cvPublicId = null
    try {
      const uploaded = await uploadCVToCloudinary(buffer, userId, originalname)
      cvFileUrl  = uploaded.url
      cvPublicId = uploaded.publicId
      console.log('CV uploaded to Cloudinary:', cvFileUrl)
    } catch (e) {
      console.error('Cloudinary upload failed:', e)
      // Continue even if Cloudinary fails — extracted data still works
    }

    // 3. Delete old CV from Cloudinary if exists
    const existing = await prisma.resume.findUnique({ where: { userId } })
    if (existing?.filePath) {
      await deleteCVFromCloudinary(existing.filePath)
    }

    // 4. Save to database
    await prisma.resume.upsert({
      where:  { userId },
      update: {
        rawText:    JSON.stringify(extractedData),
        cvFileUrl,
        cvFileName: originalname,
        filePath:   cvPublicId, // store publicId in filePath for deletion later
        source:     'UPLOAD',
      },
      create: {
        userId,
        rawText:    JSON.stringify(extractedData),
        cvFileUrl,
        cvFileName: originalname,
        filePath:   cvPublicId,
        source:     'UPLOAD',
      },
    })

    res.json({
      success: true,
      message: 'CV uploaded and extracted successfully',
      data:    extractedData,
    })
  } catch (error: any) {
    console.error('CV upload error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload CV',
    })
  }
})

// GET /api/resume
router.get('/', authMiddleware, async (req: any, res: Response) => {
  try {
    const resume = await prisma.resume.findUnique({
      where:   { userId: req.user.id },
      include: {
        education:   true,
        experience:  true,
        skills:      true,
        coverLetter: true,
      },
    })
    res.json({ success: true, data: { resume } })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resume' })
  }
})

// DELETE /api/resume/cv — remove CV file
router.delete('/cv', authMiddleware, async (req: any, res: Response) => {
  try {
    const resume = await prisma.resume.findUnique({ where: { userId: req.user.id } })
    if (resume?.filePath) {
      await deleteCVFromCloudinary(resume.filePath)
    }
    await prisma.resume.update({
      where: { userId: req.user.id },
      data:  { cvFileUrl: null, cvFileName: null, filePath: null },
    })
    res.json({ success: true, message: 'CV file removed' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove CV' })
  }
})

export default router