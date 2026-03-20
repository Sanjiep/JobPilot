import OpenAI from 'openai'

const openrouter = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': 'https://jobpilot.app',
    'X-Title': 'JobPilot',
  },
})

export const MODELS = {
  CV:       process.env.CV_MODEL       || 'qwen/qwen2.5-vl-72b-instruct:free',
  FILL:     process.env.FILL_MODEL     || 'mistralai/mistral-small-3.1-24b-instruct:free',
  FAST:     process.env.FAST_MODEL     || 'meta-llama/llama-3.2-11b-vision-instruct:free',
  FALLBACK: process.env.FALLBACK_MODEL || 'google/gemma-3-27b-it:free',
}

export async function chat(
  messages: OpenAI.ChatCompletionMessageParam[],
  model = MODELS.FAST,
  maxTokens = 1000,
): Promise<string> {
  try {
    const res = await openrouter.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages,
    })
    return res.choices[0]?.message?.content || ''
  } catch (error) {
    if (model !== MODELS.FALLBACK) {
      const res = await openrouter.chat.completions.create({
        model: MODELS.FALLBACK,
        max_tokens: maxTokens,
        messages,
      })
      return res.choices[0]?.message?.content || ''
    }
    throw error
  }
}

export default openrouter