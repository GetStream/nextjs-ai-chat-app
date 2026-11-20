import { StreamClient } from '@stream-io/node-sdk';

export async function POST(request: Request) {
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

  const body = await request.json();
  const userId = body?.userId;

  if (!userId) {
    return Response.json(
      { error: 'Bad Request: User ID field (userId) not present in request.' },
      { status: 400 }
    );
  }

  // The client connects with this token as a fixed string (no token provider refreshes it),
  // so it must not expire. `generateUserToken` would expire after one hour.
  const token = serverClient.generatePermanentUserToken({ user_id: userId });

  const response = {
    userId: userId,
    token: token,
  };

  return Response.json(response);
}
