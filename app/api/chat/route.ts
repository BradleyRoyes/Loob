import { kv } from '@vercel/kv';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

import { auth } from '@/auth';
import { nanoid } from '@/lib/utils';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, previewToken } = json;
  const userId = (await auth())?.user.id;

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  if (previewToken) {
    openai.apiKey = previewToken;
  }

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true,
  });

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100);
      const id = json.id ?? nanoid();
      const createdAt = Date.now();
      const path = `/chat/${id}`;
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant',
          },
        ],
      };

      // Perform KV database operations
      try {
        await kv.hmset(`chat:${id}`, payload);
        await kv.zadd(`user:chat:${userId}`, {
          score: createdAt,
          member: `chat:${id}`,
        });
        console.log(`Chat saved and indexed successfully for user ${userId} with chat ID ${id}`); // Minimal logging
      } catch (error) {
        console.error(`Error saving or indexing chat for user ${userId} with chat ID ${id}:`, error); // Error handling
      }
    },
  });

  return new StreamingTextResponse(stream);
}
