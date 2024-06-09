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
  setUpdateGameData,
}) => {
  const newPlayerEventFilter = contract.filters.NewPlayer();

  addNewEvent(newPlayerEventFilter, provider, ({ args }) => {
    console.log("new player added", args);
    if (walletAddress === args.owner) {
      toast.success("Player registered");
      navigate("/");
    }
  });

  ///
  const newBattleEventFilter = contract.filters.NewBattle();

  addNewEvent(newBattleEventFilter, provider, ({ args }) => {
    //
    console.log("new battle started", args, walletAddress);

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    )
      navigate(`/battle/${args.battleName}`);

    setUpdateGameData((prev) => prev + 1);
  });
};
