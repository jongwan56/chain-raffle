//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/utils/Strings.sol";

contract ChainRaffle {
    struct Event {
        address creator;
        string eventName;
        string[] participants;
        uint256 drawNumber; // how many winners should be drawn?
        bool isDrawn;
        uint256[] winners;
    }

    address public owner;
    Event[] public events;

    constructor() {
        owner = msg.sender;
    }

    function isEquals(
        string memory str1,
        string memory str2
    ) private pure returns (bool) {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }

    function isExistEvent(
        string calldata eventName
    ) private view returns (bool) {
        for (uint256 i = 0; i < events.length; i++) {
            if (isEquals(events[i].eventName, eventName)) return true;
        }
        return false;
    }

    function getEventIndex(
        string calldata eventName
    ) private view returns (uint256) {
        for (uint256 i = 0; i < events.length; i++) {
            if (isEquals(events[i].eventName, eventName)) return i;
        }
        require(false, "Unreachable..");
        return 0;
    }

    function addEvent(string calldata eventName, uint256 drawNumber) public {
        require(!isExistEvent(eventName), "Event is duplicated");
        require(drawNumber != 0, "The number of winners must be not zero");
        Event memory newEvent;
        newEvent.eventName = eventName;
        newEvent.drawNumber = drawNumber;
        newEvent.creator = msg.sender;
        events.push(newEvent);
    }

    function removeEvent(string calldata eventName) public {
        require(isExistEvent(eventName), "Event not exists");
        uint256 eventIndex = getEventIndex(eventName);
        require(
            msg.sender == owner || msg.sender == events[eventIndex].creator,
            "Caller must be the owner or event creator"
        );
        events[eventIndex] = events[events.length - 1];
        events.pop();
    }

    function addParticipantToEvent(
        string calldata eventName,
        string calldata participantName
    ) public {
        require(isExistEvent(eventName), "Event not exists");
        uint256 eventIndex = getEventIndex(eventName);
        require(
            msg.sender == events[eventIndex].creator,
            "Caller must be the event creator"
        );
        require(!events[eventIndex].isDrawn, "Event is finished");
        for (uint256 i = 0; i < events[eventIndex].participants.length; i++) {
            require(
                !isEquals(participantName, events[eventIndex].participants[i]),
                "Participant is duplicated"
            );
        }
        events[eventIndex].participants.push(participantName);
    }

    function draw(string calldata eventName) public {
        require(isExistEvent(eventName), "Event not exists");
        uint256 eventIndex = getEventIndex(eventName);
        require(
            msg.sender == events[eventIndex].creator,
            "Caller must be the event creator"
        );
        require(!events[eventIndex].isDrawn, "Event is finished");
        require(
            events[eventIndex].participants.length >=
                events[eventIndex].drawNumber,
            "Insufficient participants number"
        );

        uint256 drawCounter = 0;
        uint256 state = 0;
        while (drawCounter < events[eventIndex].drawNumber) {
            uint256 randIndex = uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.prevrandao, state)
                )
            ) % events[eventIndex].participants.length;
            state += 1;
            bool isDuplicate = false;
            for (uint256 i = 0; i < drawCounter; i++) {
                if (events[eventIndex].winners[i] == randIndex) {
                    isDuplicate = true;
                    break;
                }
            }
            if (isDuplicate) continue;
            events[eventIndex].winners.push(randIndex);
            drawCounter += 1;
        }
        events[eventIndex].isDrawn = true;
    }

    function getEvents() public view returns (string memory) {
        string memory ret;
        for (uint256 i = 0; i < events.length; i++) {
            ret = string.concat(ret, events[i].eventName);
            ret = string.concat(ret, ",");
            ret = string.concat(
                ret,
                Strings.toString(events[i].drawNumber)
            );
            if (events[i].isDrawn) {
                ret = string.concat(ret, ",1");
            } else {
                ret = string.concat(ret, ",0");
            }
            if (i != events.length - 1) {
                ret = string.concat(ret, ",");
            }
        }
        return ret;
    }

    function getEventByName(
        string calldata eventName
    ) public view returns (string memory) {
        require(isExistEvent(eventName), "Event not exists");
        uint256 eventIndex = getEventIndex(eventName);
        string memory ret;

        ret = string.concat(ret, events[eventIndex].eventName);
        ret = string.concat(ret, ",");
        ret = string.concat(
            ret,
            Strings.toString(events[eventIndex].drawNumber)
        );
        ret = string.concat(ret, events[eventIndex].isDrawn ? ",1" : ",0");

        return ret;
    }

    function getEventParticipants(
        string calldata eventName
    ) public view returns (string memory) {
        require(isExistEvent(eventName), "Event not exists");
        uint256 eventIndex = getEventIndex(eventName);
        string memory ret;
        for (uint256 i = 0; i < events[eventIndex].participants.length; i++) {
            ret = string.concat(ret, events[eventIndex].participants[i]);
            if (i != events[eventIndex].participants.length - 1) {
                ret = string.concat(ret, ",");
            }
        }
        return ret;
    }

    function getEventWinners(
        string calldata eventName
    ) public view returns (string memory) {
        require(isExistEvent(eventName), "Event not exists");
        uint256 eventIndex = getEventIndex(eventName);
        require(events[eventIndex].isDrawn, "Event is not drawn yet");
        string memory ret;
        for (uint256 i = 0; i < events[eventIndex].winners.length; i++) {
            uint256 winnerIndex = events[eventIndex].winners[i];
            ret = string.concat(
                ret,
                events[eventIndex].participants[winnerIndex]
            );
            if (i != events[eventIndex].winners.length - 1) {
                ret = string.concat(ret, ",");
            }
        }
        return ret;
    }
}
