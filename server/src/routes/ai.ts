import { Router, Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { chat, MODELS } from "../lib/openrouter";

const router = Router();

// POST /api/ai/extract-cv (LinkedIn URL)
router.post("/extract-cv", authMiddleware, async (req: any, res: Response) => {
  try {
    const { linkedinUrl } = req.body;

    if (!linkedinUrl) {
      return res
        .status(400)
        .json({ success: false, message: "LinkedIn URL is required" });
    }

    const prompt = `A user provided their LinkedIn URL: ${linkedinUrl}

Return ONLY a valid JSON object with this structure and no explanation:
{
  "firstName": "",
  "lastName": "",
  "email": "",
  "phone": "",
  "city": "",
  "country": "",
  "website": "${linkedinUrl}",
  "linkedin": "${linkedinUrl}",
  "summary": "",
  "education": [],
  "experience": [],
  "technical": [],
  "soft": [],
  "languages": [],
  "certifications": ""
}

Since we cannot scrape LinkedIn, return the URL in the linkedin field and leave other fields empty. Return ONLY the JSON.`;

    const content = await chat(
      [{ role: "user", content: prompt }],
      MODELS.CV,
      500,
    );

    let data: Record<string, any> = {};
    try {
      const clean = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        data = JSON.parse(clean.slice(start, end + 1));
      }
    } catch {
      data = { linkedin: linkedinUrl, website: linkedinUrl };
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error("LinkedIn extract error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to extract LinkedIn data" });
  }
});

// POST /api/ai/cover-letter
router.post(
  "/cover-letter",
  authMiddleware,
  async (req: any, res: Response) => {
    try {
      const {
        profile,
        experience,
        skills,
        education,
        languages,
        certifications,
      } = req.body;

      const name =
        `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
        "the applicant";
      const skillsList = Array.isArray(skills) ? skills.join(", ") : "";
      const langList = Array.isArray(languages) ? languages.join(", ") : "";
      const expList = Array.isArray(experience)
        ? experience
            .map(
              (e: any) =>
                `${e.title} at ${e.company}${e.description ? ": " + e.description.slice(0, 100) : ""}`,
            )
            .join("\n")
        : "";
      const eduList = Array.isArray(education)
        ? education
            .map(
              (e: any) =>
                `${e.degree}${e.institution ? " from " + e.institution : ""}`,
            )
            .join(", ")
        : "";

      const prompt = `Write a short, professional general cover letter for a job applicant. Keep it concise — exactly 3 paragraphs.

Candidate Details:
- Name: ${name}
- Email: ${profile?.email || ""}
- Phone: ${profile?.phone || ""}
- Location: ${profile?.city || ""}, ${profile?.country || ""}
- Summary: ${profile?.summary || ""}

Work Experience:
${expList || "Not provided"}

Education:
${eduList || "Not provided"}

Skills: ${skillsList || "Not provided"}
Languages: ${langList || "Not provided"}
Certifications: ${certifications || "Not provided"}

Instructions:
- Address as "Dear Hiring Manager,"
- Paragraph 1: Brief intro — who they are and their background
- Paragraph 2: Key experience and skills they bring
- Paragraph 3: Short enthusiasm + call to action (2-3 sentences max)
- End with this exact sign-off format:
  Best regards,
  ${name}
  ${profile?.email || ""}
  ${profile?.phone || ""}
- Do NOT use placeholders like [Company Name] or [Position]
- Do NOT add any commentary outside the letter
- Keep total length under 200 words`;

      const coverLetter = await chat(
        [{ role: "user", content: prompt }],
        MODELS.COVER_LETTER,
        1000,
      );

      res.json({ success: true, data: { coverLetter } });
    } catch (error: any) {
      console.error("Cover letter error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to generate cover letter" });
    }
  },
);

// POST /api/ai/translate
router.post('/translate', authMiddleware, async (req: any, res: Response) => {
  try {
    const { text, targetLanguage } = req.body

    if (!text || !targetLanguage) {
      return res.status(400).json({ success: false, message: 'Text and targetLanguage are required' })
    }

    const translated = await chat(
      [{
        role: 'user',
        content: `Translate the following cover letter to ${targetLanguage}. Keep the same professional tone, formatting and structure. Return ONLY the translated text, nothing else.\n\n${text}`,
      }],
      MODELS.COVER_LETTER,
      1000
    )

    res.json({ success: true, data: { translated } })
  } catch (error: any) {
    console.error('Translate error:', error)
    res.status(500).json({ success: false, message: 'Failed to translate' })
  }
})

export default router;
