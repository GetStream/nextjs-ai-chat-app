import { StreamChat } from 'stream-chat';
import { v4 as uuidv4 } from 'uuid';

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

  const { userId } = await req.json();
  const channel = serverClient.channel('messaging', uuidv4(), {
    members: [userId, 'ai'],
    created_by_id: userId,
  });
  const creationResult = await channel.create();
  console.log('creationResult: ', creationResult);

  return Response.json({ channelId: channel.id });
}
