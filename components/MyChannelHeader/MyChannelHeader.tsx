import { useChatContext } from 'stream-chat-react';
import Star from '../Icons/Star';
import ThreeDots from '../Icons/ThreeDots';
import Bookmark from '../Icons/Bookmark';

export default function MyChannelHeader() {
  const { channel } = useChatContext();

  return (
    <div className='bg-background-gray border-b-2 border-border-gray h-24 px-8 py-8 flex justify-between items-center'>
      <h2 className='text-3xl font-semibold text-primary-text '>
        {channel?.data?.name ?? 'Unknown'}
      </h2>
      <div className='flex items-center gap-6 text-secondary-text'>
        <Star />
        <Bookmark />
        <ThreeDots />
      </div>
    </div>
  );
}
