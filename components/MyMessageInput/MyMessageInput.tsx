import {
  AttachmentPreviewList,
  ChatAutoComplete,
  FileUploadIcon,
  useMessageInputContext,
} from 'stream-chat-react';

export default function MyMessageInput() {
  const { text, handleChange, handleSubmit } = useMessageInputContext();
  return (
    <div className='flex items-center gap-4 w-full px-4 py-2 bg-background-gray border-t-2 border-border-gray rounded-md text-primary-text'>
      {/* <AttachmentPreviewList />
      <FileUploadIcon /> */}
      <textarea
        value={text}
        className='bg-background-gray text-primary-text flex-1 resize-none h-10 flex items-center p-2'
        onChange={handleChange}
        placeholder={'Type something...'}
        rows={1}
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}
