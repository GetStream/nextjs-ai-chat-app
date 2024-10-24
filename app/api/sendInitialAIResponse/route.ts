import { StreamChat } from 'stream-chat';

export async function POST(req: Request, res: Response) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Server Error: Couldn't find API key." },
      { status: 500 }
    );
  }

  const streamSecret = process.env.STREAM_SECRET;
  if (!streamSecret) {
    return Response.json(
      { error: "Server Error: Couldn't find secret." },
      { status: 500 }
    );
  }
  const serverClient = StreamChat.getInstance(apiKey, streamSecret);

  const { channelId, message } = await req.json();
  const channel = serverClient.channel('messaging', channelId);

  const messageQueryResponse = await channel.query({});
  const messageCount = messageQueryResponse.messages.length;

  if (messageCount === 1) {
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
              role: 'system',
              content:
                'You are supposed to give a short summary of a prompt for a chat channel title.',
            },
            {
              role: 'user',
              content: `Give a short summary of the prompt a user is giving you in 3-5 words, DO NOT USER MORE WORDS and do not include quotation marks for it. It will serve as the title of a chat channel. It needs to be precise and really capture the essence of the request. Here is the prompt: ${message}`,
            },
          ],
        }),
      }
    );
    const generatedJson = await generatedTitle.json();
    await channel.updatePartial({
      set: { name: generatedJson?.choices[0].message.content },
    });
  }

  const messageResponse = await channel.sendMessage({
    text: 'Thinking ...',
    user_id: 'ai',
    channelId: channelId,
    message: message,
    isStreaming: true,
  });

  console.log('MessageResponse: ', messageResponse);

  return Response.json({});
}
