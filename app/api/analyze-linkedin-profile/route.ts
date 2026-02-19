import { NextRequest } from 'next/server';
import { analyzeProfile, getCredits } from '@/orca-ai';

export const POST = async (request: NextRequest) => {
  const { url } = await request.json();

  if (!url || typeof url !== 'string') {
    return Response.json({ error: 'Missing or invalid "url" field' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const { analysis, collectedData, stats } = await analyzeProfile(url, {
          onProgress: (event) => send('progress', event),
        });

        const credits = getCredits();

        console.info(
          `[linkedin-profile] Analysis complete for ${analysis.profileName}`,
          `\n  Data collection: ${(stats.collectDurationMs / 1000).toFixed(1)}s`,
          `\n  Agent analysis: ${(stats.analysisDurationMs / 1000).toFixed(1)}s`,
          `\n  Total: ${(stats.totalDurationMs / 1000).toFixed(1)}s`,
          `\n  Tool calls: ${stats.toolCallCount}`,
          `\n  Insights: ${stats.insightCount}`,
          `\n  Credits: ${credits?.remaining ?? '?'}/${credits?.limit ?? '?'} remaining`,
        );

        send('result', { analysis, collectedData, stats, credits });
      } catch (err) {
        send('error', { error: err instanceof Error ? err.message : 'Unknown error' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
};
