import { Router, Response } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import prisma from '../lib/prisma'

const router = Router()

// POST /api/onboarding/complete
router.post('/complete', authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.user.id
    const {
      personal,
      education,
      experience,
      technical,
      soft,
      languages,
      certifications,
      coverLetter,
      coverLetterSource,
      situation,
      workPrefs,
      countries,
      jobPrefs,
      frequency,
      automation,
    } = req.body

    const links = personal?.links || []
    const linkedinUrl = links.find((l: any) => l.platform === 'linkedin')?.url || null
    const websiteUrl =
      links.find((l: any) => ['portfolio', 'other', 'dribbble', 'behance', 'twitter'].includes(l.platform))?.url ||
      personal?.website ||
      null

    // 1. Save profile
    if (personal) {
      await prisma.profile.upsert({
        where:  { userId },
        update: {
          firstName:   personal.firstName   || '',
          lastName:    personal.lastName    || '',
          phone:       personal.phone       || null,
          nationality: personal.nationality || null,
          address:     personal.address     || null,
          city:        personal.city        || null,
          country:     personal.country     || null,
          photoUrl:    personal.photoUrl    || null,
          dateOfBirth: personal.dateOfBirth ? new Date(personal.dateOfBirth) : null,
          website:     websiteUrl,
        },
        create: {
          userId,
          firstName:   personal.firstName   || '',
          lastName:    personal.lastName    || '',
          phone:       personal.phone       || null,
          nationality: personal.nationality || null,
          address:     personal.address     || null,
          city:        personal.city        || null,
          country:     personal.country     || null,
          photoUrl:    personal.photoUrl    || null,
          dateOfBirth: personal.dateOfBirth ? new Date(personal.dateOfBirth) : null,
          website:     websiteUrl,
        },
      })
    }

    // 2. Save resume + education + experience + skills + cover letter
    const resume = await prisma.resume.upsert({
      where:  { userId },
      update: {
        source: 'MANUAL',
        linkedinUrl,
      },
      create: {
        userId,
        source: 'MANUAL',
        linkedinUrl,
      },
    })

    // Education
    if (education && education.length > 0) {
      await prisma.education.deleteMany({ where: { resumeId: resume.id } })
      await prisma.education.createMany({
        data: education.map((e: any, i: number) => ({
          resumeId:    resume.id,
          degree:      e.degree      || '',
          institution: e.institution || '',
          field:       e.field       || null,
          startDate:   e.startDate   ? new Date(e.startDate + '-01') : null,
          endDate:     e.endDate     ? new Date(e.endDate   + '-01') : null,
          current:     e.current     || false,
          gpa:         e.gpa         || null,
          description: e.description || null,
          order:       i,
        })),
      })
    }

    // Work experience
    if (experience && experience.length > 0) {
      await prisma.workExperience.deleteMany({ where: { resumeId: resume.id } })
      await prisma.workExperience.createMany({
        data: experience.map((e: any, i: number) => ({
          resumeId:    resume.id,
          title:       e.title       || '',
          company:     e.company     || '',
          location:    e.location    || null,
          startDate:   e.startDate   ? new Date(e.startDate + '-01') : null,
          endDate:     e.endDate     ? new Date(e.endDate   + '-01') : null,
          current:     e.current     || false,
          description: e.description || null,
          order:       i,
        })),
      })
    }

    // Skills
    await prisma.skill.deleteMany({ where: { resumeId: resume.id } })

    const skillsToCreate: any[] = []

    if (technical && technical.length > 0) {
      technical.forEach((s: any) => {
        skillsToCreate.push({
          resumeId: resume.id,
          name:     typeof s === 'string' ? s : s.name,
          type:     'TECHNICAL',
        })
      })
    }

    if (soft && soft.length > 0) {
      soft.forEach((s: any) => {
        skillsToCreate.push({
          resumeId: resume.id,
          name:     typeof s === 'string' ? s : s.name,
          type:     'SOFT',
        })
      })
    }

    if (languages && languages.length > 0) {
      languages.forEach((l: any) => {
        skillsToCreate.push({
          resumeId: resume.id,
          name:     typeof l === 'string' ? l : l.name,
          type:     'LANGUAGE',
          level:    l.level || 'Intermediate',
        })
      })
    }

    if (skillsToCreate.length > 0) {
      await prisma.skill.createMany({ data: skillsToCreate })
    }

    // Cover letter
    if (coverLetter) {
      await prisma.coverLetter.upsert({
        where:  { resumeId: resume.id },
        update: {
          content: coverLetter,
          source:  coverLetterSource === 'ai'      ? 'AI_GENERATED' :
                   coverLetterSource === 'per_job'  ? 'PER_JOB'      : 'MANUAL',
        },
        create: {
          resumeId: resume.id,
          content:  coverLetter,
          source:   coverLetterSource === 'ai'      ? 'AI_GENERATED' :
                    coverLetterSource === 'per_job'  ? 'PER_JOB'      : 'MANUAL',
        },
      })
    }

    // 3. Save job preferences
    const jobPrefsData: any = {}

    if (workPrefs) {
      jobPrefsData.workTypes       = workPrefs.workTypes       || []
      jobPrefsData.employmentTypes = workPrefs.employmentTypes || []
      jobPrefsData.companySizes    = workPrefs.companySize ? [workPrefs.companySize] : []
    }

    if (countries) {
      jobPrefsData.targetCountries = countries.selected       || []
      jobPrefsData.openToAnywhere  = countries.openToAnywhere || false
    }

    if (jobPrefs) {
      jobPrefsData.targetTitles = jobPrefs.titles    || []
      jobPrefsData.industries   = jobPrefs.industries || []
    }

    if (situation) {
      jobPrefsData.employmentStatus = situation.status        || null
      jobPrefsData.noticePeriod     = situation.noticePeriod  || null
      jobPrefsData.salaryMin        = situation.salaryMin  ? parseInt(situation.salaryMin)  : null
      jobPrefsData.salaryMax        = situation.salaryMax  ? parseInt(situation.salaryMax)  : null
      jobPrefsData.salaryCurrency   = situation.currency      || null
      jobPrefsData.availabilityDate = situation.availableFrom ? new Date(situation.availableFrom) : null
    }

    if (Object.keys(jobPrefsData).length > 0) {
      await prisma.jobPreferences.upsert({
        where:  { userId },
        update: jobPrefsData,
        create: { userId, ...jobPrefsData },
      })
    }

    // 4. Save automation settings
    if (automation || frequency) {
      await prisma.automationSettings.upsert({
        where:  { userId },
        update: {
          mode:                   automation?.mode      || 'REVIEW',
          frequency:              frequency?.frequency  || 'MANUAL',
          applicationsPerSession: frequency?.count      || 10,
          preferredTime:          frequency?.time       || null,
        },
        create: {
          userId,
          mode:                   automation?.mode      || 'REVIEW',
          frequency:              frequency?.frequency  || 'MANUAL',
          applicationsPerSession: frequency?.count      || 10,
          preferredTime:          frequency?.time       || null,
        },
      })
    }

    // 5. Mark onboarding as complete
    await prisma.user.update({
      where: { id: userId },
      data:  { onboardingCompleted: true, onboardingStep: 13 },
    })

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
    })
  } catch (error: any) {
    console.error('Onboarding complete error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save onboarding data',
    })
  }
})

// PUT /api/onboarding/step — save current step progress
router.put('/step', authMiddleware, async (req: any, res: Response) => {
  try {
    const { step } = req.body
    await prisma.user.update({
      where: { id: req.user.id },
      data:  { onboardingStep: step },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save step' })
  }
})

export default router
