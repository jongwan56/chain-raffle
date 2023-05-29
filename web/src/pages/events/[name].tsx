import { Eip1193Provider, ethers } from 'ethers';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Event } from '..';
import { useAccount } from '../../common/connector';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../../common/constants';
import DrawModal from '../../components/draw-modal';
import ParticipateModal from '../../components/participate-modal';

const EventPage: NextPage = () => {
  const router = useRouter();

  const { name } = router.query;

  const account = useAccount();

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [isParticipateModalOpen, setIsParticipateModalOpen] = useState(false);

  useEffect(() => {
    if (!account) {
      router.replace('/');
    }
  }, [account, router]);

  const getEvent = async (name: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const result = await contract.getEventByName(name);
    const [, drawNumber, isDrawn] = result.split(',');

    setEvent({ name, drawNumber: +drawNumber, isDrawn: !!+isDrawn });
  };

  const getParticipants = async (name: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const result = await contract.getEventParticipants(name);

    setParticipants(result ? result.split(',') : []);
  };

  const getWinners = async (name: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const result = await contract.getEventWinners(name);

    setWinners(result ? result.split(',') : []);
  };

  useEffect(() => {
    if (name) {
      getEvent(name as string);
    }
  }, [name]);

  useEffect(() => {
    if (event) {
      getParticipants(event.name);
    }
  }, [event]);

  useEffect(() => {
    if (event?.isDrawn) {
      getWinners(event.name);
    }
  }, [event]);

  return event ? (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold text-black">{event.name}</h1>

      <div className="border-b-[1.5px] border-neutral-300 mt-6" />

      <h3 className="text-xl font-bold text-black mt-6">Draw Number: {event.drawNumber}</h3>

      <div className="border-b-[1.5px] border-neutral-300 mt-6" />

      <h3 className="text-xl font-bold text-black mt-6">Participants</h3>
      <div className={`flex flex-wrap ${participants.length ? 'mt-2' : 'mt-6'} space-x-4`}>
        {participants.map((participant, index) => (
          <div
            key={index}
            className="border-2 border-brown rounded-full flex items-center justify-center px-4 h-10 mt-4"
          >
            <p className="text-brown">{participant}</p>
          </div>
        ))}
      </div>

      {winners.length > 0 && (
        <>
          <div className="border-b-[1.5px] border-neutral-300 mt-6" />

          <h3 className="text-xl font-bold text-black mt-6">Winners</h3>
          <div className={`flex flex-wrap ${participants.length ? 'mt-2' : 'mt-6'} space-x-4`}>
            {winners.map((winner, index) => (
              <div
                key={index}
                className="border-2 border-yellow-main bg-yellow-main rounded-full flex items-center justify-center px-4 h-10 mt-4"
              >
                <p className="text-white">{winner}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="fixed left-0 bottom-12 flex justify-center items-center w-full">
        <button
          className="rounded-full bg-yellow-main px-8 h-16 disabled:bg-neutral-400"
          onClick={() => {
            setIsDrawModalOpen(true);
          }}
          disabled={event.isDrawn}
        >
          <p className="text-xl font-bold">Draw</p>
        </button>
        <button
          className="ml-4 rounded-full bg-yellow-main px-8 h-16 disabled:bg-neutral-400"
          onClick={() => {
            setIsParticipateModalOpen(true);
          }}
          disabled={event.isDrawn}
        >
          <p className="text-xl font-bold">Participate</p>
        </button>
      </div>

      {isDrawModalOpen && (
        <DrawModal
          event={event}
          onClose={() => {
            setIsDrawModalOpen(false);
          }}
          onSuccess={() => {
            getWinners(event.name);
          }}
        />
      )}

      {isParticipateModalOpen && (
        <ParticipateModal
          event={event}
          onClose={() => {
            setIsParticipateModalOpen(false);
          }}
          onSuccess={() => {
            getParticipants(event.name);
          }}
        />
      )}
    </div>
  ) : null;
};

export default EventPage;
