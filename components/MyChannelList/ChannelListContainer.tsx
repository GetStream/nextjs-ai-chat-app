import { ChannelListMessengerProps, useChatContext } from 'stream-chat-react';
import Trash from '../Icons/Trash';
import Plus from '../Icons/Plus';

export default function ChannelListContainer({
  loadedChannels,
  children,
  loading,
  error,
}: React.PropsWithChildren<ChannelListMessengerProps>) {
  const { client, setActiveChannel } = useChatContext();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <section className='bg-background-gray p-4 border-l-2 border-t-2 border-border-gray text-primary-text flex flex-col items-center h-full'>
      <div className='w-full flex gap-2 items-center px-2 pb-4 text-secondary-text'>
        <span className='text-secondary-text font-semibold text-sm'>
          Chat history
        </span>
        <span className='text-secondary-text bg-bg-gray-light rounded-full px-2 py-1 text-sm'>
          {loadedChannels?.length} conversation
          {loadedChannels?.length === 1 ? '' : 's'}
        </span>
        <Trash className='ml-auto' />
      </div>
      {children}
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
    console.log('New chat clicked');
    const userId = client.user?.id;
    console.log('userId', userId);
    const response = await fetch('/api/createChannel', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    console.log('data', data);
    const channel = client.getChannelById('messaging', data.channelId, {});
    setActiveChannel(channel);
  }
}
