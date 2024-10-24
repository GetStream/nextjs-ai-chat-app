import { useMessageContext } from 'stream-chat-react';
import Image from 'next/image';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useCallback, useEffect, useState } from 'react';

export async function* streamingFetch(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const response = await fetch(input, init);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');

  if (!reader) return;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    try {
      yield decoder.decode(value);
    } catch (e: any) {
      console.warn(e.message);
    }
  }
}

export default function MyMessage() {
  const { message } = useMessageContext();

  const [messageText, setMessageText] = useState(message.text);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [streamingFinished, setStreamingFinished] = useState(false);
  const user = message.user;

  const streamMessage = useCallback(async (messageToRespondTo: string) => {
    const it = streamingFetch('/api/streamAIResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messageToRespondTo,
      }),
    });

    for await (let value of it) {
      try {
        const jsonString = value.slice(5);
        const chunk = JSON.parse(jsonString);
        setStreamingResponse((prev) => prev + chunk.choices[0].delta.content);
      } catch (e: any) {
        console.warn(e.message);
      }
    }

    setStreamingFinished(true);
  }, []);

  useEffect(() => {
    if (streamingFinished) {
      fetch('/api/updateMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message.id,
          message: streamingResponse,
        }),
      });
    }
  }, [streamingResponse, streamingFinished, message.id]);
  useEffect(() => {
    const isStreaming = message.isStreaming;
    if (isStreaming) {
      const messageToRespondTo = message.message as string;
      if (messageToRespondTo) {
        streamMessage(messageToRespondTo);
      }
    }
  }, [
    message,
    message.isStreaming,
    message.channelId,
    message.llmUrl,
    message.message,
    streamMessage,
  ]);

  return (
    <div className='relative mb-12'>
      <div className='bg-hover-gray rounded-xl p-8 text-slate-50 overflow-x-auto max-w-full'>
        <div className='max-w-prose'>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            className=''
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');

                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    PreTag='div'
                    language={match[1]}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {streamingResponse ? streamingResponse : messageText}
          </Markdown>
        </div>
      </div>
      <div className='absolute -bottom-8 w-full px-4 flex items-end justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-secondary-text font-semibold text-sm'>
            Just now
          </span>
          <button className='text-slate-50 bg-gray-light rounded-md py-1 px-2 text-sm'>
            Edit
          </button>
        </div>
        {user?.image && (
          <Image
            src={user?.image}
            alt={user?.name ?? 'Profile image'}
            width={70}
            height={70}
            className='rounded-xl border-4 border-background-gray'
          />
        )}
      </div>
    </div>
  );
}
