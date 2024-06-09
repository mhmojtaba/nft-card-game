/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { Link } from "react-router-dom";
import { CustomButton, HOC } from "../components";
import styles from "../styles";
import { useGlobalContext } from "../context";
import toast from "react-hot-toast";

const JoinBattle = () => {
  const { contract, gameData, walletAddress, battleName, setBattleName } =
    useGlobalContext();

  const joinBattleHandler = async (name) => {
    setBattleName(name);
    try {
      await contract.joinBattle(name);
      toast.success(`successfully joining ${name}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles :</h2>
      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length ? (
          gameData.pendingBattles.filter((battle) => {
            !battle.players.includes(walletAddress).map((battle, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={battle.name + index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>
                  {index + 1} . {battle?.name}
                </p>
                <CustomButton
                  title={"join"}
                  restStyles={"mt-6"}
                  clickHandler={() => joinBattleHandler(battle.name)}
                />
              </div>
            ));
          })
        ) : (
          <p className={`${styles.joinLoading} animate-pulse`}>
            reload the page
          </p>
        )}
      </div>
      <p className={styles.infoText}>
        Or{"  "}
        <Link
          to={"/join-battle"}
          className="underline underline-offset-2 cursor-pointer hover:text-red-600"
        >
          Create
        </Link>
        {"  "}a new Battle
      </p>
    </>
  );
};

export default HOC(
  JoinBattle,

  <>
    Join <br /> A Battle
  </>,
  // biome-ignore lint/complexity/noUselessFragments: <explanation>
  <>Join an existing Battle and enjoy!!!</>
);
