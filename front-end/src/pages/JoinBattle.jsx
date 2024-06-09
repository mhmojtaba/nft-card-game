/* eslint-disable react-refresh/only-export-components */
import { Link } from "react-router-dom";
import { HOC } from "../components";
import styles from "../styles";

const JoinBattle = () => {
  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles :</h2>
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
  <>Join an existing Battle and enjoy!!!</>
);
