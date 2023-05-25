import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Eip1193Provider, ethers } from 'ethers';
import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../common/constants';
import XMarkIcon from '../components/icons/x-mark.icon';

const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }));

const Home: NextPage = () => {
  const [isReady, setIsReady] = useState(false);
  const [ethereum, setEthereum] = useState<Eip1193Provider>();
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDrawNumber, setNewEventDrawNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const account = hooks.useAccount();
  const shortAddress = useMemo(
    () => account && `${account.slice(0, 6)}...${account.slice(-4)}`,
    [account],
  );

  useEffect(() => {
    setEthereum(window.ethereum as Eip1193Provider);
    setIsReady(true);
  }, []);

  const closeModal = () => {
    setIsNewEventModalOpen(false);
    setNewEventName('');
    setNewEventDrawNumber('');
  };

  const createEvent = async () => {
    if (!ethereum) {
      return;
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contractInstance.addEvent.populateTransaction(
      newEventName,
      parseInt(newEventDrawNumber),
    );

    try {
      setIsLoading(true);
      const res = await signer.sendTransaction(tx);
      await provider.waitForTransaction(res.hash);
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
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
          {account ? (
            <div className="p-8">
              <div className="flex justify-between">
                <p className="text-2xl font-semibold text-black">My events</p>
                <button
                  className="px-4 py-2 bg-yellow-main rounded-full"
                  onClick={() => {
                    setIsNewEventModalOpen(true);
                  }}
                >
                  <p className="text-base font-semibold">+ New</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-neutral-800 text-4xl font-bold">Login please</p>
            </div>
          )}
        </div>
      </div>
      {isNewEventModalOpen && (
        <div className="fixed left-0 top-0 flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded px-6 p-8 relative w-96">
            <h2 className="text-xl font-bold mb-4 text-black">New Event</h2>
            <div className="flex flex-col">
              <p className="text-xs text-neutral-500">Name</p>
              <input
                className="mt-1 mb-2 px-3 border rounded-md text-black w-full h-10"
                type="text"
                placeholder="My event"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-2">
              <p className="text-xs text-neutral-500">Draw Number</p>
              <input
                className="mt-1 mb-2 px-3 border rounded-md text-black w-full h-10"
                type="number"
                placeholder="3"
                value={newEventDrawNumber}
                onChange={(e) => setNewEventDrawNumber(e.target.value)}
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-yellow-main text-black py-2 px-4 rounded mr-2 disabled:opacity-50"
                disabled={isLoading || !newEventName || !newEventDrawNumber}
                onClick={createEvent}
              >
                Submit
              </button>
            </div>
            <button
              className="absolute top-3 right-3 flex justify-center items-center w-6 h-6 text-black"
              disabled={isLoading}
              onClick={closeModal}
            >
              <XMarkIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
