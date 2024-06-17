/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { HOC, CustomInput, CustomButton } from "./components";
import { useGlobalContext } from "./context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function App() {
  const { walletAddress, contract, gameData } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  // console.log(walletAddress);

  const handleClick = async () => {
    //
    try {
      console.log(contract);
      if (playerName.length === 0) {
        toast.error("please enter a name");
      }
      console.log(playerName);
      const playerExists = await contract.isPlayer(walletAddress);
      !playerExists && (await contract.registerPlayer(playerName));
    } catch (error) {
      toast.error(error?.message);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const checkPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (playerExists && playerTokenExists) navigate("/create-battle");
    };

    if (contract) checkPlayerToken();
  }, [contract]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="enter your name"
        value={playerName}
        changeHandler={setPlayerName}
      />
      <CustomButton
        title="register"
        clickHandler={handleClick}
        restStyles="mt-6"
      />
    </div>
  );
}

export default HOC(
  App,

  <>
    Welcome to Avax , <br /> a web3 Card Game
  </>,
  <>
    connect wallet to start playing <br /> the ultimate web3 card game
  </>
);
