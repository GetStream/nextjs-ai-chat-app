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

  const { messageId, message } = await req.json();
  console.log('message', message);
  const updatedMessage = {
    id: messageId,
    text: message as string,
    user_id: 'ai',
    isStreaming: false,
  };

  const messageResponse = await serverClient.updateMessage(updatedMessage);

  console.log('MessageResponse: ', messageResponse);

  return Response.json({});
}
