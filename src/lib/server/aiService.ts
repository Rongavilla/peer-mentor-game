import OpenAI from 'openai'

export class AIService {
  private openai: OpenAI | null = null

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey) {
      this.openai = new OpenAI({ apiKey })
    } else {
      console.warn('OpenAI API key not found. AI features will be disabled.')
    }
  }

  async getMentorResponse(userMessage: string, context?: string): Promise<string> {
    if (!this.openai) {
      return "AI Mentor is currently unavailable. Please set up your OpenAI API key."
    }

    try {
      const systemPrompt = `You are an AI mentor for CodeQuest Academy, a gamified IT mentorship platform.
You help students learn programming and technology concepts in an encouraging, supportive way.
Keep responses concise (2-3 sentences) and encouraging. Focus on learning and skill development.
${context ? `Context: ${context}` : ''}`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 150,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'
    } catch (error) {
      console.error('OpenAI API error:', error)
      return 'Sorry, I encountered an error. Please try again.'
    }
  }

  async getHint(topic: string, playerProgress?: string): Promise<string> {
    if (!this.openai) {
      return "Hint: Keep practicing and don't give up! AI hints are currently unavailable."
    }

    try {
      const prompt = `Provide a helpful hint for a student learning about ${topic}.
${playerProgress ? `Student progress: ${playerProgress}` : ''}
Give one specific, actionable tip.`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful coding mentor providing concise hints.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || 'Keep practicing and experimenting!'
    } catch (error) {
      console.error('OpenAI API error:', error)
      return 'Keep practicing and you will master this!'
    }
  }

  async provideFeedback(answer: string, isCorrect: boolean, topic: string): Promise<string> {
    if (!this.openai) {
      if (isCorrect) {
        return "Great job! You got it right! 🎉"
      } else {
        return "Not quite right, but keep trying! You're learning! 💪"
      }
    }

    try {
      const prompt = `A student ${isCorrect ? 'correctly' : 'incorrectly'} answered a question about ${topic}.
Their answer was: "${answer}"
Provide brief, encouraging feedback (1-2 sentences).`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an encouraging IT mentor providing feedback to students.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 80,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || (isCorrect ? 'Well done!' : 'Keep learning!')
    } catch (error) {
      console.error('OpenAI API error:', error)
      return isCorrect ? 'Excellent work!' : 'Keep practicing!'
    }
  }

  isAvailable(): boolean {
    return this.openai !== null
  }
}

export const aiService = new AIService()
