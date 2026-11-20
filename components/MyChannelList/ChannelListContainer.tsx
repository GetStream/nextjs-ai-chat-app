import type { ChannelPaginator } from 'stream-chat';
import {
  ChannelList,
  useChannelPaginatorState,
  useChatContext,
  useWorkspaceNavigation,
  WithComponents,
} from 'stream-chat-react';
import Trash from '../Icons/Trash';
import Plus from '../Icons/Plus';

const LoadingChannels = () => <div>Loading...</div>;
const NoChannels = () => null;

const listOverrides = {
  EmptyListIndicator: NoChannels,
  FirstPageLoadingIndicator: LoadingChannels,
};

export default function ChannelListContainer({
  paginator,
}: {
  paginator: ChannelPaginator;
}) {
  const { client } = useChatContext();
  const { openChannel } = useWorkspaceNavigation();
  const { channels: loadedChannels } = useChannelPaginatorState(paginator);

  return (
    <section className='bg-background-gray p-4 border-l-2 border-border-gray text-primary-text flex flex-col items-center h-full min-h-0'>
      <div className='w-full flex gap-2 items-center px-2 pb-4 text-secondary-text'>
        <span className='text-secondary-text font-semibold text-sm'>
          Chat history
        </span>
        <span className='text-secondary-text bg-bg-gray-light rounded-full px-2 py-1 text-sm'>
          {loadedChannels?.length ?? 0} conversation
          {loadedChannels?.length === 1 ? '' : 's'}
        </span>
        <Trash className='ml-auto' />
      </div>
      <div className='w-full flex-1 min-h-0 overflow-y-auto'>
        <WithComponents overrides={listOverrides}>
          <ChannelList paginator={paginator} />
        </WithComponents>
      </div>
      <button
        className='mt-auto bg-button-primary flex gap-2 justify-center items-center py-4 text-primary-text m-2 rounded-xl w-full transition-colors duration-200 hover:bg-button-primary-hover'
        onClick={newChatClicked}
      >
        <Plus />
        <span className=''>New chat</span>
      </button>
    </section>
  );

  async function newChatClicked() {
    const userId = client.user?.id;
    const response = await fetch('/api/createChannel', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    // <Channel> does not query the channel it is given, so watch it before opening it.
    const channel = await client.channel('messaging', data.channelId).watch();
    // Add it to the channel list without re-querying the list.
    client.channelManager.ingestChannel(channel);
    openChannel(channel);
  }
}
