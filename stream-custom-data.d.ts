import 'stream-chat';

declare module 'stream-chat' {
  interface CustomMessageData {
    channelId?: string;
    isStreaming?: boolean;
    llmUrl?: string;
    message?: string;
  }
}
