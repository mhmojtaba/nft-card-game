import { ethers } from "ethers";
import { ABI } from "../contract";
import toast from "react-hot-toast";

const addNewEvent = (filter, provider, cb) => {
  provider.removeListener(filter); //preventing multiple listener for the same event
  provider.on(filter, (logs) => {
    const parsedLogs = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parsedLogs);
  });
};

export const createEventsListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
}) => {
  const newPlayerEventFilter = contract.filters.NewPlayer();

  addNewEvent(newPlayerEventFilter, provider, ({ args }) => {
    console.log(args);
    if (walletAddress == args.owner) {
      toast.success("Player registered");
      navigate("/");
    }
  });
};
