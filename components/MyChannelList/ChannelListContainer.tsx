import { ChannelListMessengerProps } from 'stream-chat-react';
import Trash from '../Icons/Trash';

export default function ChannelListContainer({
  loadedChannels,
  children,
  loading,
  error,
}: React.PropsWithChildren<ChannelListMessengerProps>) {
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <section className='bg-background-gray p-4 border-l-2 border-t-2 border-border-gray text-primary-text h-full'>
      <div className='flex gap-2 items-center px-2 pb-4 text-secondary-text'>
        <span className='text-secondary-text font-semibold text-sm'>
          Chat history
        </span>
        <span className='text-secondary-text bg-bg-gray-light rounded-full px-2 py-1 text-sm'>
          {loadedChannels?.length} conversation
          {loadedChannels?.length === 1 ? '' : 's'}
        </span>
        <Trash className='ml-auto' />
      </div>
      {children}
    </section>
  );
}
