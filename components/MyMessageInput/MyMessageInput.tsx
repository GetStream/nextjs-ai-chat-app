import {
  TextareaComposer,
  useMessageComposerSubmitFn,
} from 'stream-chat-react';
import ArrowUp from '../Icons/ArrowUp';

export default function MyMessageInput() {
  // Sends the composer's message (Enter in the textarea sends it too).
  const submit = useMessageComposerSubmitFn();
  return (
    <div className='flex items-center gap-4 px-4 py-2 bg-background-gray border-2 border-border-gray rounded-md text-primary-text m-8'>
      <TextareaComposer
        className='bg-background-gray text-primary-text flex-1 resize-none p-2 outline-none'
        containerClassName='flex-1'
        placeholder={'Type to ask the AI...'}
      />
      <button
        onClick={() => submit()}
        className='bg-button-primary p-2 rounded-lg font-semibold'
      >
        <ArrowUp />
      </button>
    </div>
  );
}
