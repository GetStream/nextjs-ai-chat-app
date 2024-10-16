import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useCreateChatClient,
} from 'stream-chat-react';
import { ChannelSort, User } from 'stream-chat';
import { EmojiPicker } from 'stream-chat-react/emojis';
import ChannelListContainer from './MyChannelList/ChannelListContainer';
import ChannelListPreview from './MyChannelList/ChannelListPreview';
import ChannelListUserRow from './MyChannelList/ChannelListUserRow';
import MyMessage from './MyMessage/MyMessage';
import MyChannelHeader from './MyChannelHeader/MyChannelHeader';
import MyMessageInput from './MyMessageInput/MyMessageInput';

export default function MyChat({
  apiKey,
  user,
  token,
}: {
  apiKey: string;
  user: User;
  token: string;
}) {
  const chatClient = useCreateChatClient({
    apiKey: apiKey,
    tokenOrProvider: token,
    userData: user,
  });

  if (!chatClient) {
    return <div>Error, please try again later.</div>;
  }

  const filters = { members: { $in: [user.id] } };
  const sort: ChannelSort = { last_message_at: -1 };
  const options = { limit: 10 };
  const userImageUrl = chatClient.user?.image as string;

  return (
    <Chat client={chatClient} theme='str-chat__theme-light'>
      <Channel EmojiPicker={EmojiPicker} Message={MyMessage}>
        <Window>
          <MyChannelHeader />
          <MessageList />
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
    </Chat>
  );
}
