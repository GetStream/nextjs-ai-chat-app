import { useMessageContext } from 'stream-chat-react';
import Image from 'next/image';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function MyMessage() {
  const { message } = useMessageContext();
  const user = message.user;

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
            {message.text}
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
