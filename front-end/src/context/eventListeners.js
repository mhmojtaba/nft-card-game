import { ethers } from "ethers";
import { ABI } from "../contract";

const addNewEvent = (filter, provider, cb) => {
  provider.removeListener(filter); //preventing multiple listener for the same event
  provider.on(filter, (logs) => {
    const parsedLogs = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parsedLogs);
  });
};

export const createEventsListeners = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
};
