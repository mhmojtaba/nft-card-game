/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles";
import { useGlobalContext } from "../context";
import {
  attack,
  attackSound,
  defense,
  defenseSound,
  player01 as p01Icon,
  player02 as p02Icon,
} from "../assets";
import { playAudio } from "../utils/animation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ActionButton, Card, GameInfo, PlayerInfo } from "../components";

const Battle = () => {
  const {
    contract,
    gameData,
    walletAddress,
    battleGround,
    setErrorMessage,
    player1Ref,
    player2Ref,
  } = useGlobalContext();
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const { battleName } = useParams();
  const navigate = useNavigate();
  // console.log(battleName);

  // getting player info
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        let player01Address = null;
        let player02Address = null;

        if (
          gameData.activeBattle.player[0].toLowerCase() ===
          walletAddress.toLowerCase()
        ) {
          player01Address = gameData.activeBattle.player[0];
          player02Address = gameData.activeBattle.player[1];
        } else {
          player01Address = gameData.activeBattle.player[1];
          player02Address = gameData.activeBattle.player[0];
        }

        const player1TokenData = await contract.getPlayerToken(player01Address);
        const player01 = await contract.getPlayer(player01Address);
        const player1Attack = player1TokenData.attackStrength.toNumber();
        const player1Defense = player1TokenData.defenseStrength.toNumber();
        const player1Health = player01.playerHealth.toNumber();
        const player1Mana = player01.playerMana.toNumber();
        const player02 = await contract.getPlayer(player02Address);
        const player2Health = player02.playerHealth.toNumber();
        const player2Mana = player02.playerMana.toNumber();
        const player2TokenData = await contract.getPlayerToken(player02Address);
        const player2Attack = player2TokenData.attackStrength.toNumber();
        const player2Defense = player2TokenData.defenseStrength.toNumber();

        setPlayer1({
          ...player01,
          attack: player1Attack,
          defense: player1Defense,
          health: player1Health,
          mana: player1Mana,
        });

        setPlayer2({
          ...player02,
          attack: player2Attack,
          defense: player2Defense,
          health: player2Health,
          mana: player2Mana,
        });
      } catch (error) {
        toast.error(error?.message);
      }
    };

    if (contract && gameData.activeBattle) getPlayerInfo();
  }, [contract, battleName, gameData]);

  const makeAMove = async (move) => {
    playAudio(move === 1 ? attackSound : defenseSound);

    try {
      await contract.attackOrDefendChoice(move, battleName, {
        gasLimit: 200000,
      });

      toast.success(`choosing ${move === 1 ? "attack" : "defense"}`);
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
      setErrorMessage(error);
    }
  };

  /// check if the battle ended
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) {
        navigate("/");
      }
    }, [1000]);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${battleGround} h-full`}
    >
      <PlayerInfo player={player2} playerIcon={p02Icon} mt />
      <div className={`flex-col sm:flex-row my-10 ${styles.flexCenter}`}>
        <Card
          card={player2}
          title={player2?.playerName}
          cardRef={player2Ref}
          playerTwo
        />
        <div className=" flex items-center flex-row">
          <ActionButton
            img={attack}
            clickHandler={() => makeAMove(1)}
            restStyles="mr-2 hover:border-yellow-400"
          />
          <Card
            card={player1}
            title={player1?.playerName}
            cardRef={player1Ref}
            restStyles="mt-4"
          />
          <ActionButton
            img={defense}
            clickHandler={() => makeAMove(2)}
            restStyles="ml-2 hover:border-red-500"
          />
        </div>
      </div>
      <PlayerInfo player={player1} playerIcon={p01Icon} mt />

      {/* game info data */}
      <GameInfo />
    </div>
  );
};

export default Battle;
