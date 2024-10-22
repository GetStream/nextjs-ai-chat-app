import Image from 'next/image';
import { useMemo } from 'react';
import { useTranslationContext } from 'stream-chat-react';

export default function ChannelListPreview({
  channel,
  activeChannel,
  displayTitle,
  latestMessage,
  setActiveChannel,
}: any) {
  const latestMessageAt = channel.state.last_message_at;
  const { userLanguage } = useTranslationContext();

  const timestamp = useMemo(() => {
    if (!latestMessageAt) {
      return '';
    }
    const formatter = new Intl.DateTimeFormat(userLanguage, {
      timeStyle: 'short',
    });
    return formatter.format(latestMessageAt);
  }, [latestMessageAt, userLanguage]);

  const members = Object.values(channel.state.members).map(
    (member: any) => member.user
  );
  return (
    <button
      className={`${
        activeChannel.id === channel.id ? 'bg-hover-gray' : 'bg-gray-light'
      } space-y-2 cursor-pointer p-4 my-2 rounded-xl w-full flex flex-col items-start transition-colors hover:bg-hover-gray`}
      onClick={() => setActiveChannel(channel)}
    >
      <h2 className='text-primary-text text-lg'>{displayTitle}</h2>
      <p className='text-secondary-text text-sm max-h-6 text-ellipsis overflow-hidden text-left'>
        {latestMessage}
      </p>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-2'>
          {members.map((member: any) => (
            <Image
              key={member.id}
              width={32}
              height={32}
              src={member.image}
              alt={member.name}
              className='w-8 h-8 bg-background-gray rounded-full'
            />
          ))}
        </div>
        <span className='text-tertiary-text text-sm'>{timestamp}</span>
      </div>
    </button>
  );
}
