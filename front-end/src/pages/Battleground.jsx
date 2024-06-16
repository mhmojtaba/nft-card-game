import styles from "../styles";
import { battlegrounds } from "../assets";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Battleground = () => {
  const navigate = useNavigate();
  const { setBattleGround } = useGlobalContext();

  const chooseBattleGroundHandler = (ground) => {
    setBattleGround(ground.id);

    localStorage.setItem("battleGround", ground.id);
    toast.success(`${ground.name} is Ready!`);

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  return (
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
      <h1 className={`${styles.headText} text-center`}>
        Choose your <span className={"text-violet-600"}>Battle</span> Ground
      </h1>

      <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
        {battlegrounds.map((ground) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={ground.id}
            className={`${styles.flexCenter} ${styles.battleGroundCard}`}
            onClick={() => chooseBattleGroundHandler(ground)}
          >
            <img
              src={ground.image}
              alt="ground"
              className={styles.battleGroundCardImg}
            />
            <div className="info absolute">
              <p className={styles.battleGroundCardText}>{ground.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Battleground;
