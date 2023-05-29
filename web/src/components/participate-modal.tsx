import { Eip1193Provider, ethers } from 'ethers';
import { FC, useState } from 'react';
import XMarkIcon from './icons/x-mark.icon';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../common/constants';
import { Event } from '../pages';

type Props = {
  event: Event;
  onClose: () => void;
  onSuccess: () => void;
};

const ParticipateModal: FC<Props> = ({ event, onClose, onSuccess }) => {
  const [participantName, setParticipantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setParticipantName('');
    onClose();
  };

  const participateEvent = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    setIsLoading(true);

    try {
      const res = await contract.addParticipantToEvent(event.name, participantName);
      await res.wait();

      onSuccess();
    } catch (error) {
      // if ((error as Error).message.includes('duplicated')) {
      //   Toast
      // }
    }

    setIsLoading(false);
    closeModal();
  };

  return (
    <div className="fixed left-0 top-0 flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg px-6 p-8 relative w-96">
        <h2 className="text-2xl font-bold mb-4 text-black">{event.name}</h2>
        <div className="flex flex-col">
          <p className="text-xs text-neutral-500">Your Name</p>
          <input
            className="mt-1 mb-2 px-3 border rounded-md text-black w-full h-10"
            type="text"
            placeholder="John Doe"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="bg-yellow-main text-black py-2 px-4 rounded mr-2 disabled:opacity-50"
            disabled={isLoading || !participantName}
            onClick={participateEvent}
          >
            Participate
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
  );
};

export default ParticipateModal;
