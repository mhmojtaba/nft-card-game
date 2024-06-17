import { ethers } from "ethers";
import { ABI } from "../contract";
import toast from "react-hot-toast";
import { playAudio, sparcle } from "../utils/animation";
import { defenseSound } from "../assets";

const zeroAccount = "0x00";

const addNewEvent = (filter, provider, cb) => {
  provider.removeListener(filter); //preventing multiple listener for the same event
  provider.on(filter, (logs) => {
    const parsedLogs = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parsedLogs);
  });
};

const getCoordinates = (cardRef) => {
  const { top, left, width, height } = cardRef.current.getBoundingClientRect();
  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

export const createEventsListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setUpdateGameData,
  player1Ref,
  player2Ref,
}) => {
  const newPlayerEventFilter = contract.filters.NewPlayer();
  addNewEvent(newPlayerEventFilter, provider, ({ args }) => {
    console.log("new player added", args);
    if (walletAddress === args.owner) {
      toast.success("Player registered");
      navigate("/");
    }
  });

  const newGameTokenEventFilter = contract.filters.NewGameToken();
  addNewEvent(newGameTokenEventFilter, provider, ({ args }) => {
    console.log("new game token battle created", args);
    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      toast.success("player game token has been successfully created!");
    }

    navigate("/create-battle");
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

  const BattleMoveEventFilter = contract.filters.BattleMove();
  addNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    //
    console.log("battle move initiated", args);
  });

  const roundEndedEventFilter = contract.filters.RoundEnded();
  addNewEvent(roundEndedEventFilter, provider, ({ args }) => {
    //
    console.log("round ended", args, walletAddress);
    for (let index = 0; index < args.damagedPlayers.length; index++) {
      if (args.damagedPlayers[index] !== zeroAccount) {
        if (args.damagedPlayers[index] === walletAddress) {
          sparcle(getCoordinates(player1Ref));
        } else if (args.damagedPlayers[index] !== walletAddress) {
          sparcle(getCoordinates(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    setUpdateGameData((prev) => prev + 1);
  });

  const battleEndedEventFilter = contract.filters.BattleEnded();
  addNewEvent(battleEndedEventFilter, provider, ({ args }) => {
    console.log("battle ended", args, walletAddress);

    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      toast.success("You won the Battle");
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      toast.error("You Lost the Battle");
    }

    navigate("/create-battle");
  });
};
