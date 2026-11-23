import 'stream-chat';

// stream-chat v10 keeps custom channel fields, including the channel `name`, under
// `channel.data.custom`. Declaring them here types `channel.data?.custom?.name`.
declare module 'stream-chat' {
  interface CustomChannelData {
    name?: string;
  }
}
