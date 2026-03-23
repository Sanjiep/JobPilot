import OpenAI from 'openai'

// Use NVIDIA if key is set, otherwise fall back to OpenRouter
const useNvidia = !!process.env.NVIDIA_API_KEY

const ai = new OpenAI({
  baseURL: useNvidia
    ? (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1')
    : (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'),
  apiKey: useNvidia
    ? (process.env.NVIDIA_API_KEY || '')
    : (process.env.OPENROUTER_API_KEY || ''),
  defaultHeaders: useNvidia ? {} : {
    'HTTP-Referer': 'https://jobpilot.app',
    'X-Title': 'JobPilot',
  },
})

export const MODELS = {
  CV:           process.env.CV_TEXT_MODEL      || 'meta/llama-4-maverick-17b-128e-instruct',
  CV_VISION:    process.env.CV_VISION_MODEL    || 'google/gemma-3-27b-it',
  COVER_LETTER: process.env.COVER_LETTER_MODEL || 'meta/llama-4-maverick-17b-128e-instruct',
  FILL:         process.env.FILL_MODEL         || 'meta/llama-4-maverick-17b-128e-instruct',
  FALLBACK:     process.env.FALLBACK_MODEL     || 'mistralai/mistral-large-3-675b-instruct-2512',
}

export async function chat(
  messages: OpenAI.ChatCompletionMessageParam[],
  model = MODELS.CV,
  maxTokens = 2000,
): Promise<string> {
  try {
    const res = await ai.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages,
    })
    return res.choices[0]?.message?.content || ''
  } catch (error: any) {
    console.warn(`Model ${model} failed: ${error.message}, trying fallback...`)
    if (model !== MODELS.FALLBACK) {
      const res = await ai.chat.completions.create({
        model: MODELS.FALLBACK,
        max_tokens: maxTokens,
        messages,
      })
      return res.choices[0]?.message?.content || ''
    }
    throw error
  }
}

export default ai