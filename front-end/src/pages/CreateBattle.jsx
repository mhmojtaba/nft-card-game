/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */

import { Link } from "react-router-dom";
import { CustomButton, CustomInput, GameLoad, HOC } from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CreateNewBattle = () => {
  const { contract, battleName, setBattleName, gameData } = useGlobalContext();
  const [wait, setWait] = useState(false);

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigator(`/battle/${gameData?.activeBattle?.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) setWait(true);
  }, [gameData]);

  const createBattleHandler = async () => {
    if (!battleName || !battleName.trim()) return;
    try {
      await contract.createBattle(battleName);
      setWait(true);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <>
      {wait && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeholder="Enter the Battle name"
          changeHandler={setBattleName}
          value={battleName}
        />
        <CustomButton
          clickHandler={createBattleHandler}
          restStyles={"mt-6"}
          title={"Create Battle"}
        />
      </div>
      <p className={styles.infoText}>
        Or{"  "}
        <Link
          to={"/join-battle"}
          className=" underline-offset-2 text-red-600 cursor-pointer hover:underline"
        >
          Join
        </Link>
        {"  "}
        an already existing battles
      </p>
    </>
  );
};

export default HOC(
  CreateNewBattle,

  <>
    Create <br /> a new battle
  </>,
  <>Create your own battle and wait for another one to join!</>
);
