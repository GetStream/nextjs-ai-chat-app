import Image from 'next/image';
import { useMemo } from 'react';
import { type ChannelStateData, nsToDate } from 'stream-chat';
import {
  type ChannelListItemUIProps,
  useStateStore,
  useTranslationContext,
  useWorkspaceNavigation,
} from 'stream-chat-react';

const membersSelector = ({ members }: ChannelStateData) => ({ members });

export default function ChannelListPreview({
  active,
  channel,
  displayTitle,
  previewedMessage,
}: ChannelListItemUIProps) {
  const { openChannel } = useWorkspaceNavigation();
  const { members: channelMembers } = useStateStore(
    channel.state,
    membersSelector
  );
  // The previewed message is the channel's latest message and updates live.
  // `channel.data.last_message_at` only changes when the channel is queried.
  const latestMessageAt = previewedMessage?.created_at;
  const { userLanguage } = useTranslationContext();

  const timestamp = useMemo(() => {
    if (!latestMessageAt) {
      return '';
    }
    const formatter = new Intl.DateTimeFormat(userLanguage, {
      timeStyle: 'short',
    });
    return formatter.format(nsToDate(latestMessageAt));
  }, [latestMessageAt, userLanguage]);

  const members = Object.values(channelMembers).map((member) => member.user);
  return (
    <button
      aria-selected={active}
      className={`${
        active ? 'bg-hover-gray' : 'bg-gray-light'
      } space-y-2 cursor-pointer p-4 my-2 rounded-xl w-full flex flex-col items-start transition-colors hover:bg-hover-gray`}
      onClick={(event) => openChannel(channel, { event })}
      role='option'
    >
      <h2 className='text-primary-text text-lg'>{displayTitle}</h2>
      <p className='text-secondary-text text-sm max-h-6 text-ellipsis overflow-hidden text-left'>
        {previewedMessage?.text}
      </p>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-2'>
          {members.map(
            (member) =>
              member?.image && (
                <Image
                  key={member.id}
                  width={32}
                  height={32}
                  src={member.image}
                  alt={member.name ?? 'Profile image'}
                  className='w-8 h-8 bg-background-gray rounded-full'
                />
              )
          )}
        </div>
        <span className='text-tertiary-text text-sm'>{timestamp}</span>
      </div>
    </button>
  );
}
