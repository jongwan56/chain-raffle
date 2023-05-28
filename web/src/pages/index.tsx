import { NextPage } from 'next';
import Link from 'next/link';
import { useAccount } from '../common/connector';

const Home: NextPage = () => {
  const account = useAccount();

  return account ? (
    <div className="flex-1 flex flex-col items-center justify-center space-y-5">
      <Link
        className="w-72 h-32 border-4 border-neutral-800 rounded-full flex items-center justify-center"
        href="/new"
      >
        <p className="text-neutral-800 font-bold text-2xl">Create New Event</p>
      </Link>
      <Link
        className="w-72 h-32 border-4 border-neutral-800 rounded-full flex items-center justify-center"
        href="/participate"
      >
        <p className="text-neutral-800 font-bold text-2xl">Participate to Event</p>
      </Link>
      <Link
        className="w-72 h-32 border-4 border-neutral-800 rounded-full flex items-center justify-center"
        href="/draw"
      >
        <p className="text-neutral-800 font-bold text-2xl">Draw Event</p>
      </Link>
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-neutral-800 text-4xl font-bold">Login please</p>
    </div>
  );
};

export default Home;
