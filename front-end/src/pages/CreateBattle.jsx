/* eslint-disable react-refresh/only-export-components */

import { HOC } from "../components";

const CreateBattle = () => {
  return (
    <div>
      <h1>Hello </h1>
    </div>
  );
};

export default HOC(
  CreateBattle,

  <>
    Create <br /> a new battle
  </>,
  <>Create yuor own battle and wite for another one to join!</>
);
