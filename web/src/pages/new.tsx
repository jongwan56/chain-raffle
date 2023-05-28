import { Eip1193Provider, ethers } from 'ethers';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount } from '../common/connector';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../common/constants';

const NewPage: NextPage = () => {
  const router = useRouter();

  const [newEventName, setNewEventName] = useState('');
  const [newEventDrawNumber, setNewEventDrawNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const account = useAccount();

  useEffect(() => {
    if (!account) {
      router.replace('/');
    }
  }, [account, router]);

  const createEvent = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
    const signer = await provider.getSigner();

    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contractInstance.addEvent.populateTransaction(
      newEventName,
      parseInt(newEventDrawNumber),
    );

    try {
      setIsLoading(true);
      const res = await signer.sendTransaction(tx);
      await res.wait();
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="bg-white rounded p-8 w-96">
        <h2 className="text-3xl font-bold mb-4 text-black">New Event</h2>
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
      </div>
    </div>
  );
};

export default NewPage;
