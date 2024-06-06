/* eslint-disable react-refresh/only-export-components */
import { HOC } from "./components";

function App() {
  return <div></div>;
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
