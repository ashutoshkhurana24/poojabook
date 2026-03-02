import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { occasion, location, budget, timing, language } = await req.json()

    const poojas = await prisma.pooja.findMany({
      include: { category: true },
    })

    const poojaList = poojas.map(p => 
      `- ${p.title} (slug: ${p.slug}, mode: ${p.mode}, price: ₹${p.basePrice}, category: ${p.category?.name})`
    ).join('\n')

    const prompt = `You are a Hindu religious ceremony expert helping someone find the perfect pooja.

The person's requirements:
- Occasion: ${occasion}
- Preferred location: ${location}
- Budget: ${budget}
- Timing: ${timing}
- Language preference: ${language}

Available poojas on our platform:
${poojaList}

Based on their requirements, recommend the BEST matching pooja from the list above.

Respond ONLY with a valid JSON object in this exact format, no other text:
{
  "recommendedPooja": {
    "slug": "exact-slug-from-list",
    "name": "Pooja Name",
    "reason": "2-3 sentence explanation of why this pooja is perfect for their occasion",
    "whatToExpect": "Brief description of what happens during this pooja",
    "duration": "estimated duration e.g. 1-2 hours",
    "auspiciousTip": "one tip about the best time or day to perform this"
  },
  "alternativePooja": {
    "slug": "another-slug-from-list",
    "name": "Alternative Pooja Name",
    "reason": "Why this is also a good option"
  },
  "personalizedMessage": "A warm, personalized 1-sentence blessing message for their specific occasion"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      return NextResponse.json({ success: false, error: data.error.message }, { status: 500 })
    }

    const text = data.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const recommendation = JSON.parse(clean)

    return NextResponse.json({ success: true, recommendation })
  } catch (error) {
    console.error('Matchmaker error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get recommendation' }, { status: 500 })
  }
}
