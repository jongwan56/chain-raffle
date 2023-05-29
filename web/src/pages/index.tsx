import { Eip1193Provider, ethers } from 'ethers';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from '../common/connector';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../common/constants';
import NewModal from '../components/new-modal';
import ParticipateModal from '../components/participate-modal';

export type Event = {
  name: string;
  drawNumber: number;
  isDrawn: boolean;
};

const Home: NextPage = () => {
  const router = useRouter();

  const account = useAccount();

  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [participateIndex, setParticipateIndex] = useState(-1);

  const parseEventsFromString = (str: string) => {
    return str.split(',').reduce((acc, value, index, array) => {
      if (index % 3 === 0) {
        acc.push({ name: value, drawNumber: +array[index + 1], isDrawn: !!+array[index + 2] });
      }
      return acc;
    }, [] as Event[]);
  };

  const getEvents = useCallback(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const result: string = await contract.getEvents();

    const events = result ? parseEventsFromString(result) : [];

    setEvents(events);
  }, []);

  useEffect(() => {
    if (account) {
      getEvents();
    }
  }, [account, getEvents]);

  return account ? (
    <>
      <div className="p-8 w-full">
        <div className="flex justify-between items-center w-full">
          <p className="text-3xl font-bold text-black">Events</p>
          <button
            className="w-24 h-12 bg-yellow-main rounded-full"
            onClick={() => {
              setIsNewEventModalOpen(true);
            }}
          >
            <p className="text-lg font-semibold">+ New</p>
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {events.map((event) => (
            <button
              key={event.name}
              className="bg-white p-6 rounded-lg flex flex-col"
              onClick={() => {
                router.push(`/events/${event.name}`);
              }}
            >
              <h3 className="text-black text-2xl font-semibold">{event.name}</h3>
              <p className="mt-2 text-black">Draw Number: {event.drawNumber}</p>
              <p className="mt-2 text-black">
                Current state:{' '}
                {event.isDrawn
                  ? event.drawNumber > 1
                    ? 'Winners picked.'
                    : 'Winner picked.'
                  : 'Open to participants'}
              </p>
              <div className="mt-4 w-full h-12 rounded-full border-[1px] border-neutral-300 hover:bg-neutral-200 flex items-center justify-center">
                <p className="text-neutral-800">{event.isDrawn ? 'See result' : 'See detail'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isNewEventModalOpen && (
        <NewModal
          onClose={() => {
            setIsNewEventModalOpen(false);
          }}
          onSuccess={() => {
            getEvents();
          }}
        />
      )}

      {participateIndex >= 0 && (
        <ParticipateModal
          event={events[participateIndex]}
          onClose={() => {
            setParticipateIndex(-1);
          }}
          onSuccess={() => {
            getEvents();
          }}
        />
      )}
    </>
  ) : (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-neutral-800 text-4xl font-bold">Login please</p>
    </div>
  );
};

export default Home;
