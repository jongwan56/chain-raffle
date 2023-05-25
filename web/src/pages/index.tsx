import { NextPage } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

const Home: NextPage = () => {
  return (
    <main className={`flex flex-col min-h-screen ${inter.className}`}>
      <header className="flex justify-between items-center pl-6 pr-4 bg-white h-20">
        <h1 className="text-3xl font-extrabold text-brown">ChainRaffle</h1>
        <button className="px-5 py-3 border-[1.5px] border-brown rounded-full flex items-center">
          <Image src="/MetaMask_Fox.svg" width={30} height={30} alt="MetaMask Logo" />
          <p className="ml-2 text-brown font-semibold">Login with MetaMask</p>
        </button>
      </header>
      <div className="flex-grow bg-neutral-200"></div>
    </main>
  );
};

export default Home;
