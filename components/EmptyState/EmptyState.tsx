import ArrowUp from '../Icons/ArrowUp';
import Bookmark from '../Icons/Bookmark';
import Gallery from '../Icons/Gallery';
import Notes from '../Icons/Notes';
import Play from '../Icons/Play';
import Square from '../Icons/Square';
import Trophy from '../Icons/Trophy';

export default function EmptyState(): JSX.Element {
  const options: { title: string; icon: React.ReactNode; color: string }[] = [
    {
      title: 'Photo edition',
      icon: <Gallery />,
      color: 'text-violet-500 bg-violet-900',
    },
    {
      title: 'Video generation',
      icon: <Play />,
      color: 'text-red-500 bg-red-900',
    },
    {
      title: 'Education feedback',
      icon: <Trophy />,
      color: 'text-blue-500 bg-blue-900',
    },
    {
      title: 'Code generation',
      icon: <Square />,
      color: 'text-green-500 bg-green-900',
    },
    {
      title: 'Audio generation',
      icon: <Notes />,
      color: 'text-orange-500 bg-orange-900',
    },
  ];

  return (
    <section className='flex flex-col items-center justify-center gap-4 h-full'>
      <h1 className='text-4xl text-primary-text font-semibold'>
        Unlock the power of AI
      </h1>
      <h3 className='text-2xl text-secondary-text font-light'>
        Chat with the smartest AI - Experience the power of AI with us
      </h3>
      <div className='mt-8 space-y-4'>
        {options.map((option, index) => (
          <button
            key={`${option.title}-${index}`}
            className={`flex gap-6 items-center border-2 border-border-gray rounded-lg p-4 w-96 cursor-pointer hover:bg-hover-gray transition-colors duration-200`}
          >
            <div className={`p-2 ${option.color} rounded-lg`}>
              {option.icon}
            </div>
            <h5 className='text-lg text-white font-semibold flex-1'>
              {option.title}
            </h5>
            <div className='rotate-90 text-secondary-text'>
              <ArrowUp />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
