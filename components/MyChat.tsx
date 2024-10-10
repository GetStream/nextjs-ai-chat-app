import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useCreateChatClient,
  ChannelHeader,
} from 'stream-chat-react';
import { ChannelSort, User } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';
import { EmojiPicker } from 'stream-chat-react/emojis';

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

  return (
    <Chat client={chatClient} theme='str-chat__theme-light'>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel EmojiPicker={EmojiPicker}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
