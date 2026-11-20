import { useMessageContext } from 'stream-chat-react';
import Image from 'next/image';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useCallback, useEffect, useState } from 'react';
import { streamingFetch } from '@/lib/streamingFetch';

export default function MyMessage() {
  const { message } = useMessageContext();
  const user = message.user;

  const [streamingResponse, setStreamingResponse] = useState('');
  const [streamingFinished, setStreamingFinished] = useState(false);

  const streamMessage = useCallback(
    async (messageToRespondTo: string, signal: AbortSignal) => {
      setStreamingResponse('');
      setStreamingFinished(false);
      const it = streamingFetch('/api/streamAIResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToRespondTo,
        }),
        signal,
      });

      // The LLM sends server-sent events (`data: {...}` lines). A chunk can hold several
      // events or end in the middle of one, so keep the unfinished line for the next chunk.
      let buffer = '';
      try {
        for await (let value of it) {
          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const jsonString = line.replace(/^data: /, '').trim();
            if (!jsonString || jsonString === '[DONE]') continue;
            try {
              const chunk = JSON.parse(jsonString);
              const content = chunk.choices?.[0]?.delta?.content ?? '';
              setStreamingResponse((prev) => prev + content);
            } catch (e: any) {
              console.warn(e.message);
            }
          }
        }
      } catch (e: any) {
        // Aborted (the message unmounted) or the connection dropped.
        if (signal.aborted) return;
        console.warn(e.message);
      }

      if (!signal.aborted) {
        setStreamingFinished(true);
      }
    },
    []
  );

  useEffect(() => {
    if (streamingFinished) {
      fetch('/api/updateMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message.id,
          // An empty answer means the LLM call failed. Store an error text instead,
          // so the message stops streaming and is not requested again on every render.
          message:
            streamingResponse ||
            'Sorry, I could not get an answer from the AI. Is the local LLM running?',
        }),
      });
    }
  }, [streamingResponse, streamingFinished, message.id]);

  // Depend on these values, not on the `message` object, so that a re-render or an
  // unrelated update of the message does not start another stream.
  const isStreaming = message.custom?.isStreaming;
  const messageToRespondTo = message.custom?.message;
  useEffect(() => {
    if (!isStreaming || !messageToRespondTo) return;

    // Stop the stream when the message unmounts. In development, React StrictMode runs
    // this effect twice: the first stream is aborted here and only the second one writes
    // the answer.
    const controller = new AbortController();
    streamMessage(messageToRespondTo, controller.signal);
    return () => controller.abort();
  }, [message.id, isStreaming, messageToRespondTo, streamMessage]);

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
            {streamingResponse ? streamingResponse : message.text}
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
