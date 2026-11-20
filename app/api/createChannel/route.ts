import { StreamClient } from '@stream-io/node-sdk';
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
  const serverClient = new StreamClient(apiKey, streamSecret);

  const { userId } = await req.json();
  const channel = serverClient.chat.channel('messaging', uuidv4());
  const creationResult = await channel.getOrCreate({
    data: {
      created_by_id: userId,
      members: [{ user_id: userId }, { user_id: 'ai' }],
    },
  });
  console.log('creationResult: ', creationResult);

  return Response.json({ channelId: channel.id });
}
