export const CONTRACT_ADDRESS = '0x3730d46c06572325fE649E075d6977Cd317113A9';
export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'eventName',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'drawNumber',
        type: 'uint256',
      },
    ],
    name: 'addEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'eventName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'participantName',
        type: 'string',
      },
    ],
    name: 'addParticipantToEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'eventName',
        type: 'string',
      },
    ],
    name: 'draw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'events',
    outputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'eventName',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'drawNumber',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isDrawn',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'eventName',
        type: 'string',
      },
    ],
    name: 'getEventParticipants',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'eventName',
        type: 'string',
      },
    ],
    name: 'getEventWinners',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEvents',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'eventName',
        type: 'string',
      },
    ],
    name: 'removeEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
