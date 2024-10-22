import {
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChatContext,
} from 'stream-chat-react';
import { ChannelFilters, ChannelSort, User } from 'stream-chat';
import { EmojiPicker } from 'stream-chat-react/emojis';
import ChannelListContainer from './MyChannelList/ChannelListContainer';
import ChannelListPreview from './MyChannelList/ChannelListPreview';
import ChannelListUserRow from './MyChannelList/ChannelListUserRow';
import MyMessage from './MyMessage/MyMessage';
import MyChannelHeader from './MyChannelHeader/MyChannelHeader';
import MyMessageInput from './MyMessageInput/MyMessageInput';
import { useEffect } from 'react';

export default function MyChat({ user }: { user: User }) {
  const { client, channel } = useChatContext();

  useEffect(() => {
    const unsubscribeFunction = channel?.on('message.new', (event) => {
      const messageBody = event?.message?.text;
      if (event?.user?.id === user.id && messageBody) {
        console.log('Call bot response API');
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

  const filters: ChannelFilters = { members: { $in: [user.id] } };
  const sort: ChannelSort = { last_message_at: -1 };
  const options = { limit: 10 };
  const userImageUrl = user.image as string;

  return (
    <>
      <Channel EmojiPicker={EmojiPicker} Message={MyMessage}>
        <Window>
          <MyChannelHeader />
          <MessageList disableDateSeparator />
          <MessageInput Input={MyMessageInput} />
        </Window>
        <Thread />
      </Channel>
      <section className='w-2/5 flex flex-col bg-background-gray'>
        {userImageUrl && <ChannelListUserRow imageUrl={userImageUrl} />}
        <ChannelList
          List={ChannelListContainer}
          Preview={ChannelListPreview}
          filters={filters}
          sort={sort}
          options={options}
          sendChannelsToList
        />
      </section>
    </>
  );
}
