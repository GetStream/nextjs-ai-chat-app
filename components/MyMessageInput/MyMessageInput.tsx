import { useMessageInputContext } from 'stream-chat-react';
import ArrowUp from '../Icons/ArrowUp';

export default function MyMessageInput() {
  const { text, handleChange, handleSubmit } = useMessageInputContext();
  return (
    <div className='flex items-center gap-4 px-4 py-2 bg-background-gray border-2 border-border-gray rounded-md text-primary-text m-8'>
      <textarea
        value={text}
        className='bg-background-gray text-primary-text flex-1 resize-none h-10 flex items-center p-2'
        onChange={handleChange}
        placeholder={'Type to ask the AI...'}
        rows={1}
      />
      <button
        onClick={handleSubmit}
        className='bg-button-primary p-2 rounded-lg font-semibold'
      >
        <ArrowUp />
      </button>
    </div>
  );
}
