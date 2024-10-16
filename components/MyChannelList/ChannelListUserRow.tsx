import Image from 'next/image';

export default function ChannelListUserRow({
  imageUrl,
}: {
  imageUrl: string | undefined;
}) {
  return (
    <div className='p-4 flex gap-6 justify-center items-center'>
      {imageUrl && (
        <div className='relative'>
          <Image
            src={imageUrl}
            alt={'Profile image'}
            width={50}
            height={50}
            className='rounded-full'
          />
          <div className='size-4 border-2 border-background-gray bg-green-500 rounded-full absolute bottom-0 right-0' />
        </div>
      )}
      <button className='bg-white py-2 px-6 text-slate-800 m-2 rounded-xl font-semibold transition-colors duration-200 hover:bg-gray-300'>
        Share
      </button>
    </div>
  );
}
