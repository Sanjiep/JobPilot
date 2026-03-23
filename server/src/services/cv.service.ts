/* eslint-disable @typescript-eslint/no-var-requires */
const mammoth  = require('mammoth')
const PDFParser = require('pdf2json')

import ai, { chat, MODELS } from '../lib/openrouter'

const EXTRACTION_PROMPT = `You are a CV/Resume parser. Extract all information from the provided CV and return ONLY a valid JSON object. No explanation, no markdown, no backticks, just raw JSON.

Return exactly this structure (leave fields as empty string if not found):
{
  "firstName": "",
  "lastName": "",
  "email": "",
  "phone": "",
  "dateOfBirth": "",
  "nationality": "",
  "address": "",
  "city": "",
  "country": "",
  "website": "",
  "linkedin": "",
  "github": "",
  "summary": "",
  "education": [
    {
      "degree": "",
      "institution": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "gpa": "",
      "description": ""
    }
  ],
  "experience": [
    {
      "title": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "technical": [],
  "soft": [],
  "languages": [
    {
      "name": "",
      "level": "Intermediate"
    }
  ],
  "certifications": ""
}

Rules:
- Dates must be in YYYY-MM format (e.g. 2020-06)
- technical and soft must be arrays of plain strings
- languages must be array of objects with name and level
- level must be one of: Beginner, Intermediate, Advanced, Native
- Return ONLY the JSON object, absolutely nothing else`

// Safe JSON parser
function safeParseJSON(text: string): Record<string, any> {
  try {
    const clean = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    const start = clean.indexOf('{')
    const end   = clean.lastIndexOf('}')
    if (start === -1 || end === -1) return {}

    return JSON.parse(clean.slice(start, end + 1))
  } catch (e) {
    console.error('JSON parse failed:', e)
    return {}
  }
}

// Extract text from PDF using pdf2json
async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve) => {
    try {
      const pdfParser = new PDFParser(null, 1)

      pdfParser.on('pdfParser_dataError', (err: any) => {
        console.error('PDF parse error:', err)
        resolve('')
      })

      pdfParser.on('pdfParser_dataReady', () => {
        try {
          const text = pdfParser.getRawTextContent()
          resolve(text || '')
        } catch (e) {
          console.error('PDF text extract error:', e)
          resolve('')
        }
      })

      pdfParser.parseBuffer(buffer)
    } catch (e) {
      console.error('PDF parser init error:', e)
      resolve('')
    }
  })
}

// Extract text from DOCX
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (e) {
    console.error('DOCX parse error:', e)
    return ''
  }
}

// Parse from text
async function parseFromText(text: string): Promise<Record<string, any>> {
  console.log(`Parsing CV text (${text.length} chars) with ${MODELS.CV}`)
  try {
    const content = await chat(
      [
        {
          role: 'user',
          content: `${EXTRACTION_PROMPT}\n\nCV Content:\n${text.slice(0, 8000)}`,
        },
      ],
      MODELS.CV,
      2000
    )
    console.log('Text model response received')
    return safeParseJSON(content)
  } catch (e: any) {
    console.error('Text model error:', e.message)
    return {}
  }
}

// Parse from image using vision model
async function parseFromImage(buffer: Buffer, mimeType: string): Promise<Record<string, any>> {
  const base64 = buffer.toString('base64')
  const dataUrl = `data:${mimeType};base64,${base64}`

  console.log(`Parsing CV image with ${MODELS.CV_VISION}`)
  try {
    const res = await ai.chat.completions.create({
      model: MODELS.CV_VISION,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUrl } },
            { type: 'text', text: EXTRACTION_PROMPT },
          ] as any,
        },
      ],
    })
    const content = res.choices[0]?.message?.content || '{}'
    console.log('Vision model response received')
    return safeParseJSON(content)
  } catch (e: any) {
    console.error('Vision model error:', e.message)
    return {}
  }
}

// Main export
export async function extractCVData(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<Record<string, any>> {
  const ext = originalName.split('.').pop()?.toLowerCase()
  console.log(`Processing CV: ${originalName} (${ext}, ${buffer.length} bytes)`)

  // PDF
  if (ext === 'pdf') {
    const text = await extractPdfText(buffer)
    console.log(`Extracted PDF text length: ${text.trim().length}`)
    if (text.trim().length > 100) {
      console.log('Text-based PDF detected')
      return parseFromText(text)
    } else {
      console.log('Scanned PDF detected — using vision model')
      return parseFromImage(buffer, 'image/png')
    }
  }

  // DOCX
  if (ext === 'docx') {
    const text = await extractDocxText(buffer)
    console.log(`Extracted DOCX text length: ${text.trim().length}`)
    if (text.trim().length > 50) {
      return parseFromText(text)
    }
    return {}
  }

  // Images
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
    return parseFromImage(buffer, mimeType)
  }

  console.warn(`Unsupported file type: ${ext}`)
  return {}
}