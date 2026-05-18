import OpenAI from 'openai';
import type { Business, ReviewTone } from '@/types';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const toneGuidance: Record<ReviewTone, string> = {
  professional: 'Use polished, business-appropriate language. Formal but sincere.',
  friendly: 'Use warm, conversational language. Sound like a happy regular customer.',
  emotional: 'Use personal, heartfelt language. Share genuine feelings.',
  short: 'Keep each review to 1-2 short sentences maximum.',
  detailed: 'Write 3-4 sentences with specific details about service and experience.',
};

type TemplateSet = Record<number, string[]>;

function templatesForTone(tone: ReviewTone): TemplateSet {
  const base: Record<ReviewTone, TemplateSet> = {
    professional: {
      5: [
        'Exceptional service from {name}. The team demonstrated outstanding professionalism and delivered beyond expectations.',
        'A highly professional experience at {name}. Clear communication, timely delivery, and excellent results throughout.',
        '{name} sets a high standard for {category}. I would confidently recommend their services to colleagues.',
      ],
      4: [
        'A strong professional experience at {name}. Quality work and courteous staff, with minor room for refinement.',
        '{name} provided reliable service and solid expertise. A few small process improvements would make it perfect.',
        'Professional and competent team at {name}. Overall a positive engagement I would use again.',
      ],
      3: [
        'Adequate service at {name} that met basic expectations. Some aspects were strong while others felt average.',
        '{name} delivered an acceptable experience. Neither exceptional nor disappointing — room for improvement exists.',
        'Standard professional interaction at {name}. Functional results, though not particularly memorable.',
      ],
      2: [
        'Below expectations at {name}. Several operational gaps affected the overall professional experience.',
        'Service at {name} lacked consistency. Communication and follow-through need meaningful improvement.',
        'Disappointed with aspects of the engagement at {name}. Potential is there but execution fell short.',
      ],
      1: [
        'Unacceptable experience at {name}. Professional standards were not met across multiple touchpoints.',
        'Significant concerns with service quality at {name}. Issues were raised but resolution was inadequate.',
        'Would not recommend {name} based on this experience. Fundamental improvements are required.',
      ],
    },
    friendly: {
      5: [
        'Absolutely loved {name}! Super friendly team and they made everything easy. Already telling my friends!',
        'Such a great vibe at {name} — felt welcomed from the moment I walked in. Five stars, no question!',
        'Hands down one of the best experiences I have had. The folks at {name} really care. Will be back!',
      ],
      4: [
        'Really enjoyed my visit to {name}! Lovely people and good service — just a tiny hiccup but still happy.',
        'Great experience overall at {name}. Friendly staff and solid work. Almost perfect!',
        'Had a good time with the team at {name}. Warm service and quality results. Would come again.',
      ],
      3: [
        'Okay experience at {name}. Staff were nice enough but nothing really stood out either way.',
        'Decent visit to {name} — not bad, not amazing. Fine for a one-off but unsure about returning.',
        'Mixed feelings about {name}. Some good moments, some meh ones. Middle of the road for me.',
      ],
      2: [
        'Wish I could say better things about {name}. Nice people but the experience did not match the hype.',
        'Left {name} a bit frustrated. Friendly faces but things felt disorganized behind the scenes.',
        'Not the experience I hoped for at {name}. A few issues added up and dampened the visit.',
      ],
      1: [
        'Really let down by {name} this time. Expected much more based on what I had heard.',
        'Rough visit to {name}. Hoping they turn things around because the concept is good.',
        'Would not go back to {name} after today. Several things need fixing ASAP.',
      ],
    },
    emotional: {
      5: [
        'I am genuinely grateful for everything {name} did for me. This experience truly made my day.',
        'From the bottom of my heart — thank you, {name}. You exceeded what I hoped for and more.',
        'I felt truly valued at {name}. Moments like this remind you why great businesses matter.',
      ],
      4: [
        'A heartfelt thank you to the team at {name}. Mostly wonderful, with just a small bump along the way.',
        'I appreciate the care shown at {name}. A meaningful experience I will remember fondly.',
        'Thank you {name} for a warm and caring experience. Nearly brought me to five stars.',
      ],
      3: [
        'My time at {name} left me with mixed emotions. Some kindness, some uncertainty.',
        'An honest middle-ground experience at {name}. I wanted to love it more than I did.',
        'Neutral feelings after visiting {name}. Neither moved nor upset — just okay.',
      ],
      2: [
        'I walked away from {name} feeling disappointed. I had higher hopes and that hurts.',
        'It is hard to write this, but {name} did not deliver the care I was hoping for.',
        'Emotionally drained after this visit to {name}. I hope they listen to feedback.',
      ],
      1: [
        'Deeply disappointed by {name}. I trusted them and felt let down when it mattered most.',
        'This experience at {name} was genuinely upsetting. I needed better and did not get it.',
        'Heartbroken is not too strong a word for how I feel about my visit to {name}.',
      ],
    },
    short: {
      5: ['Outstanding — highly recommend {name}!', 'Perfect experience at {name}. Five stars!', 'Love {name}. Will return!'],
      4: ['Great job, {name}. Would return.', 'Solid experience at {name}.', 'Good service at {name}, minor issues.'],
      3: ['Okay experience at {name}.', 'Average visit to {name}.', 'Fine, nothing special at {name}.'],
      2: ['Disappointed with {name}.', 'Below expectations at {name}.', 'Needs improvement, {name}.'],
      1: ['Poor experience at {name}.', 'Would not recommend {name}.', 'Very unhappy with {name}.'],
    },
    detailed: {
      5: [
        'I had an outstanding experience with {name} from start to finish. The team listened carefully to my needs, explained every step clearly, and delivered results that genuinely impressed me. Communication was proactive, timelines were respected, and the quality exceeded what I expected from a {category} provider. I have already recommended {name} to friends and will absolutely return.',
        'Choosing {name} was one of the best decisions I made this year. Every interaction felt thoughtful — from the initial consultation through final delivery. Staff were knowledgeable, patient, and went out of their way to ensure satisfaction. If you want a {category} partner that treats you like a priority, this is it.',
      ],
      4: [
        'My experience with {name} was largely excellent. The team was professional, responsive, and produced high-quality work. I appreciated the transparency throughout the process. A couple of minor delays and small communication gaps kept this from being a perfect five stars, but I would still recommend them and plan to use their services again.',
        '{name} delivered strong value as a {category} provider. Most aspects of the engagement were smooth and well-managed. Staff were friendly and competent. With slightly tighter coordination on scheduling, this would easily be a five-star experience.',
      ],
      3: [
        'My visit to {name} was a mixed experience. Some team members were helpful and knowledgeable, while other parts of the process felt rushed or inconsistent. The end result was acceptable but did not wow me. For a {category} business at this level, I expected a bit more polish. I might give them another chance, but I am not fully convinced yet.',
        'Overall, {name} met my basic expectations without exceeding them. Service was functional and pricing seemed fair, but nothing stood out as memorable. If you need a straightforward option in {category}, they are fine — just do not expect a standout experience every time.',
      ],
      2: [
        'I had several frustrations during my engagement with {name}. While individual staff members tried to help, the overall process felt disorganized. Wait times were longer than promised, and follow-up on my concerns was slower than it should have been. There is clear potential here, but meaningful operational improvements are needed before I could recommend them confidently.',
        'Unfortunately, {name} fell short of what was advertised. Key deliverables arrived late, and I had to follow up multiple times for updates. I believe the team means well, but the execution did not match the professionalism I expected from a {category} company.',
      ],
      1: [
        'I am compelled to share an honest account of a very poor experience with {name}. From the initial contact through completion, multiple commitments were missed. Quality did not meet stated standards, and when I raised concerns, the response felt dismissive rather than solution-oriented. For a business in {category}, this level of service is unacceptable. I hope management takes this feedback seriously and implements real changes.',
        'I rarely leave one-star reviews, but my experience with {name} warranted it. Expectations were set high during sales conversations, yet delivery was disorganized and the final outcome did not resolve my core issues. I cannot recommend them in their current state.',
      ],
    },
  };

  return base[tone];
}

function fillTemplate(template: string, business: Business): string {
  return template
    .replace(/\{name\}/g, business.name)
    .replace(/\{category\}/g, business.category);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateLocalSuggestions(
  business: Business,
  rating: number,
  tone: ReviewTone,
  count: number,
): string[] {
  const stars = Math.min(5, Math.max(1, Math.round(rating)));
  const pool = templatesForTone(tone)[stars] ?? templatesForTone(tone)[3];
  const filled = pool.map((t) => fillTemplate(t, business));
  const unique = [...new Set(shuffle(filled))];

  while (unique.length < count) {
    unique.push(fillTemplate(pool[unique.length % pool.length], business));
  }

  return unique.slice(0, count);
}

export async function generateAISuggestions(
  business: Business,
  rating: number,
  tone: ReviewTone,
  count: number,
  keywords?: string,
): Promise<{ suggestions: string[]; source: 'openai' | 'local' }> {
  const stars = Math.min(5, Math.max(1, Math.round(rating)));

  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        temperature: 0.85,
        messages: [
          {
            role: 'system',
            content: `You write authentic Google review drafts for customers. Tone: ${toneGuidance[tone]}. Each review must reflect exactly ${stars} star(s). Write ${count} distinct reviews. Return ONLY a JSON array of strings. No markdown.`,
          },
          {
            role: 'user',
            content: `Business: ${business.name}
Category: ${business.category}
About: ${business.description}
Star rating: ${stars}/5
${keywords ? `Customer notes: ${keywords}` : ''}`,
          },
        ],
      });

      const raw = completion.choices[0]?.message?.content?.trim() ?? '[]';
      let suggestions: string[] = [];
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          suggestions = parsed.filter((s): s is string => typeof s === 'string');
        }
      } catch {
        suggestions = raw
          .split(/\n+/)
          .map((s) => s.replace(/^[-*\d.)\]]+\s*/, '').trim())
          .filter(Boolean);
      }

      if (suggestions.length > 0) {
        return { suggestions: suggestions.slice(0, count), source: 'openai' };
      }
    } catch (err) {
      console.error('OpenAI error:', err);
    }
  }

  return {
    suggestions: generateLocalSuggestions(business, stars, tone, count),
    source: 'local',
  };
}

export async function rewriteReview(
  business: Business,
  rating: number,
  tone: ReviewTone,
  existingText: string,
): Promise<{ suggestion: string; source: 'openai' | 'local' }> {
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `Rewrite the customer's Google review. Tone: ${toneGuidance[tone]}. Keep ${rating} star sentiment. Return ONLY the rewritten review text.`,
          },
          {
            role: 'user',
            content: `Business: ${business.name}\nOriginal:\n${existingText}`,
          },
        ],
      });

      const text = completion.choices[0]?.message?.content?.trim();
      if (text) return { suggestion: text, source: 'openai' };
    } catch (err) {
      console.error('OpenAI rewrite error:', err);
    }
  }

  const [fallback] = generateLocalSuggestions(business, rating, tone, 1);
  return { suggestion: fallback, source: 'local' };
}
