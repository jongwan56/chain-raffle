import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Eip1193Provider } from 'ethers';
import { NextPage } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });
const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }));

const Home: NextPage = () => {
  const [isReady, setIsReady] = useState(false);
  const [ethereum, setEthereum] = useState<Eip1193Provider>();

  const account = hooks.useAccount();
  const shortAddress = useMemo(
    () => account && `${account.slice(0, 6)}...${account.slice(-4)}`,
    [account],
  );

  useEffect(() => {
    setEthereum(window.ethereum as Eip1193Provider);
    setIsReady(true);
  }, []);

  return (
    <main className={`flex flex-col min-h-screen ${inter.className}`}>
      <header className="flex justify-between items-center pl-6 pr-4 bg-white h-20">
        <h1 className="text-3xl font-extrabold text-brown">ChainRaffle</h1>
        {account ? (
          <button
            className="px-5 h-14 border-[1.5px] border-brown rounded-full flex items-center"
            onClick={() => {
              metaMask.resetState();
            }}
          >
            <p className="text-brown font-semibold">{shortAddress}</p>
          </button>
        ) : ethereum || !isReady ? (
          <button
            className="px-5 h-14 border-[1.5px] border-brown rounded-full flex items-center"
            disabled={!isReady}
            onClick={() => {
              metaMask.activate();
            }}
          >
            <Image src="/MetaMask_Fox.svg" width={30} height={30} alt="MetaMask Logo" />
            <p className="ml-2 text-brown font-semibold">Login with MetaMask</p>
          </button>
        ) : (
          <a
            className="px-5 h-14 border-[1.5px] border-brown rounded-full flex items-center"
            href="https://metamask.io/download/"
          >
            <Image src="/MetaMask_Fox.svg" width={30} height={30} alt="MetaMask Logo" />
            <p className="ml-2 text-brown font-semibold">Install MetaMask</p>
          </a>
        )}
      </header>
      <div className="flex-grow bg-neutral-200 flex flex-col">
        {!account && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-neutral-700 text-4xl font-bold">Login please</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
