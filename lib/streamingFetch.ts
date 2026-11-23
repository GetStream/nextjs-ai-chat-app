export async function* streamingFetch(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const response = await fetch(input, init);
  if (!response.ok) {
    console.warn(`Streaming request failed with status ${response.status}`);
    return;
  }
  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');

  if (!reader) return;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    try {
      yield decoder.decode(value, { stream: true });
    } catch (e: any) {
      console.warn(e.message);
    }
  }
}
