import { StreamClient } from '@stream-io/node-sdk';

export async function POST(req: Request, res: Response) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const streamSecret = process.env.STREAM_SECRET;
  if (!apiKey || !streamSecret) {
    return Response.json(
      { error: "Server Error: Couldn't find API key or secret." },
      { status: 500 }
    );
  }
  const { channelId, message } = await req.json();

  const serverClient = new StreamClient(apiKey, streamSecret);
  const channel = serverClient.chat.channel('messaging', channelId);

  // `state: true` is required: without it the server-side response has no messages
  const messageQueryResponse = await channel.getOrCreate({ state: true });
  const messageCount = messageQueryResponse.messages.length;

  if (messageCount === 1) {
    // If the LLM is not reachable, skip the name: the answer below must still be sent.
    try {
      const generatedTitle = await fetch(
        'http://localhost:1234/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: `Give a short summary of the prompt a user is giving you in 3-5 words, DO NOT USER MORE WORDS and do not include quotation marks for it. It will serve as the title of a chat channel. It needs to be precise and really capture the essence of the request. Here is the prompt: ${message}`,
              },
            ],
          }),
        }
      );
      const generatedJson = await generatedTitle.json();
      await channel.updateChannelPartial({
        set: { name: generatedJson?.choices[0].message.content },
      });
    } catch (e) {
      console.warn("Couldn't generate a channel name:", e);
    }
  }

  const messageResponse = await channel.sendMessage({
    message: {
      text: 'Thinking ...',
      user_id: 'ai',
      custom: {
        channelId: channelId,
        message: message,
        isStreaming: true,
      },
    },
  });

  return Response.json({});
}
