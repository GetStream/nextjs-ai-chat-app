import {
  Channel,
  ChannelPlaceholder,
  MessageList,
  MessageComposer,
  useChatContext,
  useStateStore,
  useWorkspaceNavigation,
  WithComponents,
} from 'stream-chat-react';
import type {
  ChannelPaginator,
  ChannelStateData,
  ClientUser,
} from 'stream-chat';
import ChannelListContainer from './MyChannelList/ChannelListContainer';
import ChannelListPreview from './MyChannelList/ChannelListPreview';
import ChannelListUserRow from './MyChannelList/ChannelListUserRow';
import MyMessage from './MyMessage/MyMessage';
import MyChannelHeader from './MyChannelHeader/MyChannelHeader';
import MyMessageInput from './MyMessageInput/MyMessageInput';
import { useEffect } from 'react';
import EmptyState from './EmptyState/EmptyState';

const componentOverrides = {
  ChannelListItemUI: ChannelListPreview,
  EmptyStateIndicator: EmptyState,
  MessageComposerUI: MyMessageInput,
  MessageUI: MyMessage,
};

// Re-render when the channel's data changes, e.g. when the channel gets its name.
const channelDataSelector = ({ data }: ChannelStateData) => ({ data });

export default function MyChat({
  user,
  paginator,
}: {
  user: ClientUser;
  paginator: ChannelPaginator;
}) {
  const { client } = useChatContext();
  const {
    openChannels: [channel],
  } = useWorkspaceNavigation();
  useStateStore(channel?.state, channelDataSelector);

  useEffect(() => {
    const unsubscribeFunction = channel?.on('message.new', (event) => {
      const messageBody = event?.message?.text;
      if (event?.user?.id === user.id && messageBody) {
        fetch('/api/sendInitialAIResponse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId: channel?.id,
            message: messageBody,
          }),
        });
      }
    });

    return () => {
      unsubscribeFunction?.unsubscribe();
    };
  }, [channel, user.id]);

  if (!client) {
    return <div>Error, please try again later.</div>;
  }

  const userImageUrl = user.image as string;

  return (
    <WithComponents overrides={componentOverrides}>
      <main>
        {channel ? (
          <Channel channel={channel}>
            {channel?.data?.custom?.name && <MyChannelHeader />}
            <MessageList withDateSeparator={false} />
            <MessageComposer />
          </Channel>
        ) : (
          <ChannelPlaceholder>
            <EmptyState />
          </ChannelPlaceholder>
        )}
        <section className='w-full flex flex-col bg-background-gray'>
          {userImageUrl && <ChannelListUserRow imageUrl={userImageUrl} />}
          <ChannelListContainer paginator={paginator} />
        </section>
      </main>
    </WithComponents>
  );
}
