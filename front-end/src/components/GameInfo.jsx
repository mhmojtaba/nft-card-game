/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useGlobalContext } from "../context";
import { alertIcon, gameRules } from "../assets";
import styles from "../styles";
import { useState } from "react";
import ReactTooltip from "react-tooltip";

const GameInfo = () => {
  const { contract, gameData } = useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();

  const handleBattleExit = async () => {};

  return (
    <>
      <div className={styles.gameInfoIconBox}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
          onClick={() => setToggleSidebar(true)}
        >
          <img
            src={alertIcon}
            data-for="game-rules"
            data-tip="game-rules"
            alt="info"
            className={styles.gameInfoIconImg}
          />
        </div>
      </div>
      <div
        className={`${styles.gameInfoSidebar} ${
          toggleSidebar ? "translate-x-0" : "translate-x-full"
        } ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}
      >
        <div className="flex flex-col">
          <div className={styles.gameInfoSidebarCloseBox}>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
              onClick={() => setToggleSidebar(false)}
            >
              X
            </div>
          </div>
          <h3 className={styles.gameInfoHeading}>Game Rules : </h3>
          <div className={"mt-3"}>
            {gameRules.map((item, index) => (
              <p
                key={`game-rule-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
                className={styles.gameInfoText}
              >
                <span className="font-bold">{index + 1}. </span>
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
          <CustomButton
            title="Change BattleGround"
            clickHandler={() => navigate("/battleground")}
          />
          <CustomButton title="Exit Battle" clickHandler={handleBattleExit} />
        </div>
      </div>
      <ReactTooltip id="game-rules" effect="solid" backgroundColor="#7f46f0" />
    </>
  );
};

export default GameInfo;
