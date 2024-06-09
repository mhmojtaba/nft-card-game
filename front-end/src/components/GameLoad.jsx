import { useNavigate } from "react-router-dom";
import { player01, player02 } from "../assets";
import { useGlobalContext } from "../context";
import styles from "../styles";
import CustomButton from "./CustomButton";

const GameLoad = () => {
  const { walletAddress } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className={`${styles.flexBetween} ${styles.gameLoadContainer}`}>
      <div className={styles.gameLoadBtnBox}>
        <CustomButton
          title={"choose battle ground"}
          restStyles={"mt-6"}
          clickHandler={() => navigate("/battleground")}
        />
      </div>
      <div className={`${styles.flexCenter} flex-1 flex-col`}>
        <h1 className={`${styles.headText} text-center`}>
          Waiting for a
          <br /> worthy opponent....
        </h1>
        <p className={styles.gameLoadText}>
          tip: while you&apos;re waiting, choose your battle ground
        </p>
        <div className={styles.gameLoadPlayersBox}>
          <div className={`${styles.flexCenter} flex-col`}>
            <img
              src={player01}
              className={styles.gameLoadPlayerImg}
              alt="player1"
            />
            <p className={styles.gameLoadPlayerText}>
              {walletAddress ? walletAddress.slice(0, 10) : "0x0000...00"}
            </p>
          </div>
          <h2 className={styles.gameLoadVS}>vs</h2>
          <div className={`${styles.flexCenter} flex-col`}>
            <img
              src={player02}
              className={styles.gameLoadPlayerImg}
              alt="player1"
            />
            <p className={styles.gameLoadPlayerText}>?x???...???</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoad;
