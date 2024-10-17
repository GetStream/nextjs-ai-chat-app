import { User } from 'stream-chat';
import MyChat from './MyChat';
import { Chat, useCreateChatClient } from 'stream-chat-react';

export default function MyChatContainer({
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

  return (
    <Chat client={chatClient} theme='str-chat__theme-light'>
      <MyChat user={user} />
    </Chat>
  );
}
