/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { HOC, CustomInput } from "./components";
import { useGlobalContext } from "./context";

function App() {
  const { walletAddress, contract } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  console.log(walletAddress);
  console.log(contract);
  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="enter your name"
        value={playerName}
        handler={(e) => setPlayerName(e)}
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
