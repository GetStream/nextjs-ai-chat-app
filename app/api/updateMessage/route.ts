import { StreamClient } from '@stream-io/node-sdk';

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
  const serverClient = new StreamClient(apiKey, streamSecret);

  const { messageId, message } = await req.json();

  // Replace the "Thinking ..." text with the streamed answer and clear the streaming flag,
  // so the answer is not requested again the next time the message renders.
  const messageResponse = await serverClient.chat.updateMessage({
    id: messageId,
    message: {
      text: message as string,
      user_id: 'ai',
      custom: { isStreaming: false },
    },
  });
  console.log('MessageResponse: ', messageResponse);

  return Response.json({});
}
