import { useChatContext, useMessageContext } from 'stream-chat-react';
import Image from 'next/image';
export default function MyMessage() {
  const { message } = useMessageContext();
  const { client } = useChatContext();
  const user = client.user;

  return (
    <div className='w-full relative mb-12'>
      <div className='w-full bg-hover-gray rounded-xl p-8 text-slate-50'>
        {message.text}
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
