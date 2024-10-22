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

  const { message } = await req.json();

  const llmResponse = await fetch('http://localhost:1234/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }],
      stream: true,
    }),
  });

  return new Response(llmResponse.body);
}
