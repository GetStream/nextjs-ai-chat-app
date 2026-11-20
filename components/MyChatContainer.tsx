import { useEffect, useMemo, useState } from 'react';
import {
  type Channel as StreamChannel,
  type ClientUser,
  ChannelPaginator,
} from 'stream-chat';
import {
  Chat,
  defaultWorkspaceNavigation,
  useCreateChatClient,
  type WorkspaceNavigation,
  WorkspaceNavigationProvider,
} from 'stream-chat-react';
import MyChat from './MyChat';

export default function MyChatContainer({
  apiKey,
  user,
  token,
}: {
  apiKey: string;
  user: ClientUser;
  token: string;
}) {
  const chatClient = useCreateChatClient({
    apiKey: apiKey,
    tokenOrProvider: token,
    userData: user,
  });

  // The channel shown in the chat area. No channel is open until the user selects one
  // in the channel list or starts a new chat.
  const [activeChannel, setActiveChannel] = useState<StreamChannel>();

  // The channel list is driven by a paginator registered on the client's channel manager,
  // which keeps it in sync with WebSocket events.
  const paginator = useMemo(
    () =>
      chatClient
        ? new ChannelPaginator({
            client: chatClient,
            filters: { members: { $in: [user.id] } },
            id: 'channels:history',
            paginatorOptions: { pageSize: 10 },
            sort: [{ field: 'last_message_at', direction: -1 }],
          })
        : undefined,
    [chatClient, user.id]
  );

  useEffect(() => {
    if (!chatClient || !paginator) return;
    chatClient.channelManager.insertPaginator({ paginator });
    return () => {
      chatClient.channelManager.removePaginator(paginator);
    };
  }, [chatClient, paginator]);

  // Without ChatView, the app tells the SDK which channel is open: the channel list rows
  // call `openChannel` and use `isChannelActive` to highlight the open channel.
  const navigation = useMemo<WorkspaceNavigation>(
    () => ({
      ...defaultWorkspaceNavigation,
      isChannelActive: (cid) => !!cid && cid === activeChannel?.cid,
      openChannel: (channel) => setActiveChannel(channel),
      openChannels: activeChannel ? [activeChannel] : [],
    }),
    [activeChannel]
  );

  if (!chatClient || !paginator) {
    return <div>Error, please try again later.</div>;
  }

  return (
    <Chat client={chatClient} theme='str-chat__theme-light'>
      <WorkspaceNavigationProvider value={navigation}>
        <MyChat user={user} paginator={paginator} />
      </WorkspaceNavigationProvider>
    </Chat>
  );
}
