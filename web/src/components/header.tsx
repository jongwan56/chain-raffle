import { Eip1193Provider } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useMemo, useState } from 'react';
import { metaMask, useAccount } from '../common/connector';

const Header: FC = () => {
  const [ethereum, setEthereum] = useState<Eip1193Provider>();
  const [isReady, setIsReady] = useState(false);

  const account = useAccount();
  const shortAddress = useMemo(
    () => account && `${account.slice(0, 6)}...${account.slice(-4)}`,
    [account],
  );

  useEffect(() => {
    setEthereum(window.ethereum as Eip1193Provider);
    setIsReady(true);
  }, []);

  return (
    <header className="flex justify-between items-center pl-6 pr-4 bg-white h-20">
      <Link className="text-3xl font-extrabold text-brown" href="/">
        ChainRaffle
      </Link>
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
  );
};

export default Header;
